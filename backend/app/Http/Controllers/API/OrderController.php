<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\BaseController;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\CartDetail;
use App\Models\Cart;
use App\Models\Promotion;
use App\Models\Product;
use App\Models\User;
use App\Models\ShippingAddress;
use Illuminate\Support\Facades\Auth;

class OrderController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {

            $orders = Order::with('orderDetails')
                //  ->where('user_id', Auth::id()) //khi login
                ->orderBy('order_date', 'desc')
                ->paginate(10);

            // Return the list of orders
            return response()->json([
                'status' => "success",
                'orders' => $orders
            ], 200);
        } catch (\Exception $e) {

            return response()->json([
                'status' => "error",
                'message' => 'An error occurred: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $userId = Auth::id();
        //  $userId = 2; 

        // Kiểm tra nếu người dùng chưa đăng nhập
        if (!$userId) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not authenticated'
            ], 401);
        }

        try {
            // Lấy giỏ hàng của người dùng
            $cart = Cart::with('cartDetails')->where('user_id', $userId)->first();

            if (!$cart || $cart->cartDetails->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Cart is empty or not found'
                ], 404);
            }

            // Tính tổng tiền
            $totalAmount = 0;
            foreach ($cart->cartDetails as $cartDetail) {
                $totalAmount += $cartDetail->quantity * $cartDetail->product_price;
            }

            // Áp dụng mã giảm giá
            $discountAmount = 0;
            if ($request->has('promotion_code')) {
                $promotion = Promotion::where('code', $request->input('promotion_code'))->first();
                if ($promotion && $promotion->is_active && $promotion->start_date <= now() && ($promotion->end_date === null || $promotion->end_date >= now())) {
                    if ($promotion->discount_type === 'percentage') {

                        $discountAmount = $totalAmount * ($promotion->discount_value / 100);
                    }
                }
            }

            // Giảm tổng tiền theo discountAmount
            $totalAmount1 = $totalAmount - $discountAmount;

            // Phí ship = 0 (hoặc có thể lấy từ request nếu có)
            $shippingCost = 0;

            // Kiểm tra địa chỉ
            $addressId = $request->input('address_id');
            // $addressId = 1; test

            // Kiểm tra nếu địa chỉ không tồn tại hoặc không phải của người dùng
            if (!$addressId || !ShippingAddress::where('id', $addressId)->where('user_id', $userId)->exists()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Valid address is required'
                ], 400);
            }

            // Tạo đơn hàng
            $order = Order::create([
                'user_id' => $userId,
                'order_date' => now(),
                'total_amount' => $totalAmount1 + $shippingCost,
                'promotion_id' => $promotion->id ?? null,
                'status' => 'pending',
                'address_id' => $addressId,
                'payment_method' => $request->input('payment_method', 'Thanh toán khi nhận hàng'),
                'shipping_cost' => $shippingCost
            ]);

            // Tạo chi tiết đơn hàng
            foreach ($cart->cartDetails as $cartDetail) {
                OrderDetail::create([
                    'order_id' => $order->id,
                    'product_id' => $cartDetail->product_id,
                    'variant_id' => $cartDetail->variant_id,
                    'quantity' => $cartDetail->quantity,
                    'price' => $cartDetail->product_price
                ]);
            }

            // Xóa giỏ hàng sau khi đặt hàng
            $cart->cartDetails()->delete();
            $cart->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Order placed successfully',
                'order_id' => $order->id,
                'total_amount' => $totalAmount1,
            ]);
        } catch (\Exception $e) {
            // Xử lý ngoại lệ và trả về lỗi
            return response()->json([
                'status' => 'success',
                'message' => 'An error occurred: ' . $e->getMessage()
            ], 500);
        }
    }
    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $order = Order::with('orderDetails')->where('id', $id)->first();
            if (!$order) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Order not found'
                ], 404);
            }

            return response()->json($order);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred: ' . $e->getMessage()
            ], 500);
        }
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $order = Order::where('id', $id)->first();

            if (!$order) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Order not found'
                ], 404);
            }

            if ($request->has('status')) {
                $status = $request->input('status');
                if (!in_array($status, ['pending', 'completed', 'cancelled'])) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Invalid status'
                    ], 400);
                }
                $order->status = $status;
            }

            $order->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Order updated successfully',
                'order' => $order
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {

            $order = Order::where('id', $id)->first();

            // Check if the order exists and belongs to the authenticated user
            if (!$order) {
                return response()->json(['message' => 'Order not found'], 404);
            }


            if ($order->status !== 'pending') {
                return response()->json(['message' => 'Order cannot be cancelled'], 400);
            }

            $order->status = 'cancelled';
            $order->save();

            return response()->json(['message' => 'Order cancelled successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }
}
