<?php 

namespace App\Http\Controllers\API;

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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Http\Controllers\BaseController;
use App\Models\Product;
use App\Models\ProductVariant;


class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Load the necessary relationships and include order_code
        $orders = Order::with(['address', 'promotion', 'orderDetails'])->get();
        return response()->json($orders);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderRequest $request)
    {
        DB::beginTransaction();

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
            $addressF = $address->address_line."-".$address->state."-".$address->city;

            // Create the order
            $order = Order::create([
                'user_id' => $userId,
                'total_amount' => $request->total_amount,
                'promotion_id' => $request->promotion_id,
                'status' => 'pending',
                'address_id' => $request->address_id,
                'payment_method' => $request->payment_method,
                'shipping_cost' => $request->shipping_cost,
                'order_code' => 'ORDER-' . now()->format('Ymd') . '-' . Str::upper(Str::random(5)),
                'order_date' => now(),
                'name' => $address->recipient_name,
                'phone' => $address->phone,
                'address'=> $addressF
         
            ]);

            // Create order details and delete cart items
            foreach ($cartDetails as $cartDetail) {
                OrderDetail::create([
                    'order_id' => $order->id,
                    'product_id' => $cartDetail->product_id,
                    'variant_id' => $cartDetail->variant_id,
                    'quantity' => $cartDetail->quantity,
                    'price' => $cartDetail->product_price,
                ]);
                $cartDetail->delete(); // Remove cart detail after order is processed
            }

            DB::commit();
            return response()->json([
                'message' => 'Order created successfully',
                'order' => $order->load('address', 'promotion', 'orderDetails'),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Could not create order. Please try again later.',
                'message' => $e->getMessage(),
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
            $order->load(['address', 'promotion', 'orderDetails']);
            return response()->json(['order' => $order], 200);
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
        $order->status = $request->status;
        $order->payment_method = $request->payment_method;
        $order->shipping_cost = $request->shipping_cost;
        $order->address_id = $request->address_id; // Ensure you're using the correct address_id
        $order->order_code = $request->order_code; // Allow updating order_code

        // Update 'is_active' if present in the request
        if ($request->has('is_active')) {
            $order->is_active = $request->is_active;
        }

        $order->save();
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
            'orderDetails.product',
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
                $order->status = 'cancelled';
                $order->save();
            } else {
                return response()->json([
                    'message' => 'Order cannot be cancelled. Please contact support.',
                ], 400);
            }

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

