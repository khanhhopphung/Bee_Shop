<?php

namespace App\Http\Controllers\API;

use App\Events\ProductEvent;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\Cart;
use App\Models\CartDetail;
use App\Models\OrderDetail;
use App\Models\ShippingAddress;
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Http\Controllers\BaseController;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Promotion;

class OrderController extends Controller
{
    public function __construct()
    {
        $this->autoUpdateStatus();
        $this->autoSumTotalSpent();
    }
    public function index()
    {

        // Load the necessary relationships and include order_code
        $orders = Order::with(['address', 'promotion', 'orderDetails'])->get();
        return response()->json($orders);
    }

    public function autoUpdateStatus()
    {

        $orders = Order::where('status', 'delivered')
            ->where('updated_at', '<=', now()->subDays(7)) // So sánh 'updated_at' với thời gian 7 ngày trước
            ->get();

        foreach ($orders as $order) {
            $order->status = 'completed';
            $order->save();
        }
    }

    public function autoSumTotalSpent()
    {
        $userIds = \DB::table('users')->pluck('id');
        foreach ($userIds as $userId) {
            // Lấy tổng final_amount từ bảng orders cho mỗi user_id
            $totalSpent = \DB::table('orders')
                ->where('user_id', $userId)
                ->where('status', 'completed')
                ->sum('final_amount');
            $data = [
                'total_spent' => $totalSpent
            ];
            if ($totalSpent < 5000000) {
                $data['tier_id'] = 1;
            } else if ($totalSpent >= 5000000) {
                $data['tier_id'] = 2;
            } else if ($totalSpent >= 10000000) {
                $data['tier_id'] = 3;
            } else if ($totalSpent >= 500000000) {
                $data['tier_id'] = 4;
            }

            // Cập nhật total_spent trong bảng users
            \DB::table('users')
                ->where('id', $userId)
                ->update($data);
        }
    }

    // Gọi hàm autoUpdateStatus để chạy


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderRequest $request)
    {
        // DB::beginTransaction();

        try {
            $userId = auth()->id();
            if (!$userId) {
                return response()->json(['error' => 'User not authenticated. Please log in.'], 401);
            }

            // Fetch cart details and validate
            $cartDetails = CartDetail::whereIn('id', $request->carts_detail)->get();
            if ($cartDetails->isEmpty()) {
                return response()->json(['message' => 'Cart detail not found'], 404);
            }

            // Validate shipping address
            $address = ShippingAddress::find($request->address_id);
            if (!$address) {
                return response()->json(['error' => 'Address not found'], 404);
            }
            $addressF = $address->address_line . "-" . $address->state . "-" . $address->city;
            if ($request->discount_promotion_id != null) {
                $voucherDiscount = Promotion::find($request->discount_promotion_id);
                if (!$voucherDiscount) {
                    return response()->json(['error' => 'Voucher not found'], 404);
                } else if ($voucherDiscount->discount_type == 'money') {
                    $discountAmount = $voucherDiscount->discount_value;
                } else if ($voucherDiscount->discount_type == 'percentage') {
                    $discountAmount = $request->total_amount * ($voucherDiscount->discount_value / 100);
                }
            }

            if ($request->shipping_promotion_id != null) {

                $voucherShip = Promotion::find($request->shipping_promotion_id);
                if (!$voucherShip) {
                    return response()->json(['error' => 'Ship voucher not found'], 404);
                } else if ($voucherShip->discount_type == 'shipping') {
                    $shipDiscount = $voucherShip->discount_value;
                }
            }

            if (isset($discountAmount) && !isset($shipDiscount)) {
                $fin = $request->total_amount - $discountAmount;
            } else if (!isset($discountAmount) && isset($shipDiscount)) {
                $fin = $request->total_amount + ($request->shipping_cost - $shipDiscount);
            } else if (isset($discountAmount) && isset($shipDiscount)) {
                $fin = $request->total_amount - $discountAmount + ($request->shipping_cost - $shipDiscount);
            } else {
                $fin = $request->total_amount;
            }




            // Create the order
            $order = Order::create([
                'user_id' => $userId,
                'total_amount' => $request->total_amount,
                'discount_promotion_id' => $request->discount_promotion_id,
                'shipping_promotion_id' => $request->shipping_promotion_id,
                'discount_amount' => isset($discountAmount) ? $discountAmount : 0,
                'shipping_discount' => isset($shipDiscount) ? $shipDiscount : 0,
                'final_amount' => $fin + 31000,
                'status' => 'pending',
                'address_id' => $request->address_id,
                'payment_method' => $request->payment_method,
                'shipping_cost' => $request->shipping_cost,
                'order_code' => 'ORDER-' . now()->format('Ymd') . '-' . Str::upper(Str::random(5)),
                'order_date' => now(),
                'name' => $address->recipient_name,
                'phone' => $address->phone,
                'address' => $addressF,
                // 'product_id' => $cartDetails->first()->product_id,
                // 'product_name' => Product::find($cartDetails->first()->product_id)->name ?? 'Unknown Product',

            ]);

            // Create order details and delete cart items
            foreach ($cartDetails as $cartDetail) {
                $variant = $cartDetail->productVariant()->get();
                if ($variant) {
                    if ($variant->first()->stock >= $cartDetail->quantity) {
                        $variant->first()->stock -= $cartDetail->quantity;
                        $variant->first()->save(); // Cập nhật lại số lượng sản phẩm sau mua hàng
                    } else {
                        return BaseController::error('Số Lượng Sản Phẩm Không Đủ !');
                    }
                }
                OrderDetail::create([
                    'order_id' => $order->id,
                    'product_id' => $cartDetail->product_id,
                    'variant_id' => $cartDetail->variant_id,
                    'quantity' => $cartDetail->quantity,
                    'price' => $cartDetail->product_price,
                ]);
                $cartDetail->delete(); // Remove cart detail after order is processed
            }
            $randomCode = uniqid('prod_', true);
            event(new ProductEvent($randomCode));
            $this->autoUpdateStatus();



            // DB::commit();
            return BaseController::success($order, 'Đặt hàng thành công !!!');
            // return response()->json([
            //     'message' => 'Order created successfully',
            //     'order' => $order->load('address', 'promotion', 'orderDetails'),
            // ], 201);
        } catch (\Exception $e) {
            // DB::rollBack();
            return response()->json([
                "status" => false,

                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        try {
            // Load relationships including order_code
            $order->load(['address', 'promotion', 'orderDetails', 'orderDetails.product:id,name']);
            return response()->json([
                'message' => 'Order created successfully',
                'order' => $order->load([
                    'address',
                    'promotion',
                    'orderDetails.product' // Thêm quan hệ product để lấy ảnh
                ]),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Could not fetch order. Please try again later.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrderRequest $request, Order $order)
    {
        // Update the order's fields, including order_code
        $order->status = $request->status ?? $order->status;
        $order->payment_method = $request->payment_method  ?? $order->payment_method;
        $order->shipping_cost = $request->shipping_cost ?? $order->shipping_cost;
        $order->address_id = $request->address_id  ?? $order->address_id; // Ensure you're using the correct address_id
        $order->order_code = $request->order_code ?? $order->order_code; // Allow updating order_code

        // Update 'is_active' if present in the request
        if ($request->has('is_active')) {
            $order->is_active = $request->is_active;
        }


        $order->save();
        $randomCode = uniqid('prod_', true);
        event(new ProductEvent($randomCode));
        $this->autoUpdateStatus();
        return response()->json([
            'message' => 'Order updated successfully!',
            'order' => $order->load('address', 'promotion', 'orderDetails'), // Include relationships in response
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        $order->update(["is_active" => false]);
        return response()->json([
            "status" => "success",
            "message" => "Order deactivated successfully"
        ]);
    }

    /**
     * Get all orders by user.
     */
    public function getAllOrderByUser()
    {
        try {

            $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'User not authenticated.'], 401);
            }

            // Sử dụng eager loading
            $orders = $user->orders()->with([
                'address',
                'promotion',
                'reviews',
                'orderDetails.product',
                'orderDetails.reviews',
                'orderDetails.product_variant',
                'orderDetails.product_variant.images',
                'orderDetails.product_variant.color',
                'orderDetails.product_variant.size',
                // 'orderDetails.product_variant.brand',
                // 'orderDetails.product_variant.product',
                // 'orderDetails.product_variant.product.category',
                // 'orderDetails.product_variant.product.category.parent_category',
            ])->latest('id')->get();

            return BaseController::success($orders);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Could not fetch orders. Please try again later.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
    public function getOneOrderByUser(string $id)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'User not authenticated.'], 401);
            }

            // Tìm đơn hàng cụ thể theo ID và sử dụng eager loading
            $order = Order::with([
                'address',
                'promotion',
                'orderDetails.product',
                'orderDetails.product_variant',
                'orderDetails.product_variant.images',
                'orderDetails.product_variant.color',
                'orderDetails.product_variant.size',
            ])->findOrFail($id);  // Find the order by ID, or throw an exception if not found

            return BaseController::success($order);  // Trả về đơn hàng tìm được
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Could not fetch order. Please try again later.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }





    public function cancel(Order $order)
    {
        try {
            if ($order->status == 'pending') {
                // cộng lại số lượng biến thể
                $orderDetails = $order->orderDetails()->get();
                foreach ($orderDetails as $orderDetail) {
                    $variant = $orderDetail->product_variant()->first();
                    $variant->stock += $orderDetail->quantity;
                    $variant->save();
                }
                // $variant->stock += $order->orderDetails[0]->quantity;
                // $variant->save();


                $order->status = 'cancelled';
                $order->save();
            } else {
                return response()->json([
                    'message' => 'Order cannot be cancelled. Please contact support.',
                ], 400);
            }
            $randomCode = uniqid('prod_', true);
            event(new ProductEvent($randomCode));
            $this->autoUpdateStatus();

            return response()->json([
                'message' => 'Order cancelled successfully!',
                'order' => $order,
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Could not cancel order. Please try again later.',
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
                'code' => $e->getCode(),
            ], 500);
        }
    }
}
