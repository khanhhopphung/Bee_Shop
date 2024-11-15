<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\Cart;
use App\Models\CartDetail;
use App\Models\OrderDetail;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::with('orderDetails','address')-> get();
        // return $orders[0]->orderDetails;
        return response()->json($orders, 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderRequest $request)
    {
        DB::beginTransaction(); // Bắt đầu giao dịch

    try {
        // // Tạo đơn hàng mới
        $order = Order::create([
            'user_id' => $request->user_id,
            'total_amount' => $request->total_amount,
            'promotion_id' => $request->promotion_id,
            'status' => 'pending', // Hoặc trạng thái khác tùy ý
            'address_id' => $request->address_id,
            'payment_method' => $request->payment_method,
            'shipping_cost' => $request->shipping_cost,
            'order_date' => now(), // Ngày đặt hàng
        ]);

        // Lấy thông tin sản phẩm từ giỏ hàng
        $cartItems = Cart::where('user_id', $request->user_id)->with('cartDetails')->first();
        foreach ($cartItems->cartDetails as $cartDetail) {
            // Tạo chi tiết đơn hàng
            OrderDetail::create([
                'order_id' => $order->id,
                'product_id' => $cartDetail->product_id,
                'variant_id' => $cartDetail->variant_id,
                'quantity' => $cartDetail->quantity,
                'price' => $cartDetail->product_price,
            ]);
        }

        // Xóa dữ liệu trong bảng carts và cart_details
        CartDetail::where('cart_id', $cartItems->id)->delete();
        Cart::destroy($cartItems->id);

        DB::commit(); // Xác nhận giao dịch
        return response()->json(['message' => 'Order created successfully', 'order' => $order], 201);

    } catch (\Exception $e) {
        DB::rollBack(); // Hoàn tác giao dịch
        return response()->json([
            'error' => 'Could not create order. Please try again later.',
            'message' => $e->getMessage(), // Bạn có thể ẩn message trong môi trường sản xuất
            'line'=>$e->getLine(),
            'file'=>$e->getFile(),
        ], 500);
    }
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        try {
            $order =  $order->with('orderDetails','address')->get();
      
            return response()->json([
                'order' => $order,
                // 'order_detail' => $orderDetail,
                // 'address' => $address,
            ], 200);
        } catch (\Exception $e) {
            // Trả về thông báo l��i
            return response()->json([
                'error' => 'Could not fetch product. Please try again later.',
               'message' => $e->getMessage(), // Bạn có thể ẩn message trong môi trư��ng sản xuất
            ], 500);
        }
            
        
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrderRequest $request, Order $order)
    {
        $order->status = $request->status;
        $order->payment_method = $request->payment_method;
        $order->shipping_cost = $request->shipping_cost;
        $order->address_id = $request->address_id;
        $order->save();

        // Update the address details
        

        return response()->json([
            'message' => 'Order updated successfully!',
            'order' => $order
          
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }
}
