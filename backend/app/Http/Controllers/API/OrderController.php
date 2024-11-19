<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\Cart;
use App\Models\CartDetail;
use App\Models\OrderDetail;
use App\Models\ShippingAddress;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
      
        if(auth::check()){
            if(Auth::user()->role_id == 2){
        $orders = Order::with('orderDetails','address')-> get();

            } else if(Auth::user()->role_id == 1){
                $orders = Order::where('user_id', Auth::id())->with('orderDetails','address')->get();
            }
        }
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
        
        $userId = auth()->id();
    if (!$userId) {
        return response()->json([
            'error' => 'User not authenticated. Please log in.',
        ], 401);
    }
    $idCartDetails = $request->carts_detail;
        $CartDetails = CartDetail::whereIn('id', $idCartDetails)->get();

        $prefix = 'ORDER';  // Tiền tố mã đơn
        $date = Carbon::now()->format('Ymd');  // Ngày theo định dạng YYYYMMDD
        $random_number = Str::upper(Str::random(5));  // Phần ngẫu nhiên

        // Ví dụ: ORDER-20241117-ABCDE
        

        if ($CartDetails) {
            $Address = ShippingAddress::find($request->address_id);
        // // Tạo đơn hàng mới
        $order = Order::create([
            'user_id' => $userId,
            'total_amount' => $request->total_amount,
            'promotion_id' => $request->promotion_id,
            'status' => 'pending', // Hoặc trạng thái khác tùy ý
            'address_id' => $request->address_id,
            'payment_method' => $request->payment_method,
            'shipping_cost' => $request->shipping_cost,
            'order_code' => $prefix . '-' . $date . '-' . $random_number,
            'order_date' => now(), // Ngày đặt hàng
            'name'=>  $Address->recipient_name,
            'phone'=>  $Address->phone,
            'address'=> $Address->address_line.'-'.$Address->state.'-'.$Address->city,
        ]);

        

        foreach ($CartDetails as $CartDetail) {
            // Tạo chi tiết đơn hàng
            OrderDetail::create([
                'order_id' => $order->id,
                'product_id' => $CartDetail->product_id,
                'variant_id' => $CartDetail->variant_id,
                'quantity' => $CartDetail->quantity,
                'price' => $CartDetail->product_price,
            ]);

        CartDetail::find($CartDetail->id)->delete();

        }

        $order['order_details']=$order->orderDetails;

        DB::commit(); // Xác nhận giao dịch
        return response()->json(['message' => 'Order created successfully', 'order' => $order], 201);
    } else {
        DB::rollBack();
        return response()->json(['message'=> 'Cart detail not found']);
    }

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
            $orderDetails = $order->orderDetails;
            $order['order_details'] = $orderDetails;
            $address = $order->address;
            $order['address'] = $address;

            // $order =  $order->with('orderDetails','address')->get();
      
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
        // Cập nhật các trường khác
        $order->status = $request->status;
        $order->payment_method = $request->payment_method;
        $order->shipping_cost = $request->shipping_cost;
        $order->address_id = $request->address_id;
    
        // Nếu có trường 'is_active' trong request, cập nhật nó
        if ($request->has('is_active')) {
            $order->is_active = $request->is_active;
        }
    
        $order->save();
    
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
        $order -> update( ["is_active"=>false]);
        return response()->json([
            "status" => "success",
            "message"=> "update thanh cong"
        ]);
    }
   
}
