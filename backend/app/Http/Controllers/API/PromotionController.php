<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\BaseController;
use App\Models\Promotion;
use App\Http\Requests\StorePromotionRequest;
use App\Http\Requests\UpdatePromotionRequest;
use App\Models\Order;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

class PromotionController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function __construct()
    {
        $this->model = Promotion::class;
        $this->autoUpdateStatus();
    }
    public function autoUpdateStatus() {

        $promotions= Promotion::where('is_active', true)
            ->where('end_date', '<=', now()) // So sánh 'end_date' với hiện tại
            ->get();
        if($promotions){
            foreach ( $promotions as  $promotion) {                  
                $promotion->is_active = false;
                $promotion->save();
           }
        }
        

        $promotionStart= Promotion::where('is_active', false)
            ->where('start_date', '<=', now()) // So sánh 'end_date' với hiện tại
            ->where('end_date', '>', now())
            ->get();
        if($promotionStart){

            foreach ( $promotionStart as  $promotion) {           
                $promotion->is_active = true;
                $promotion->save();
           }
        }
    
        
    }
    public function index()
    {
        try {
            return $this->get($this->model);
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "Đã xảy ra lỗi: " . $e->getMessage()
            ], 500);
        }
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
    public function store(StorePromotionRequest  $request)
    {
        try {
            return $this->insert($this->model, $request->all());
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "Đã xảy ra lỗi: " . $e->getMessage()
            ], 500);
        }
    }
    /**
     * Display the specified resource.
     */
    public function show(Promotion $promotion)
    {
        try {
            if ($promotion->is_active) {
                return $this->get($promotion, null, "id", $promotion->id);
            } else {
                return response()->json([
                    "status" => "error",
                    "message" => "This blog is not active.",
                    "data" => $promotion
                ], 200);
            }
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "Đã xảy ra lỗi: " . $e->getMessage()
            ], 500);
        }
    }


    /**
     * Show the form for editing the specified resource.
     */


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Promotion $promotion)
    {
        try {
            return $this->edit($promotion, $request->all());
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "Đã xảy ra lỗi: " . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Promotion $promotion)
    {
        try {
            $data = [
                "is_active" => false,
                "deleted_at" => now()
            ];
            $this->edit($promotion, $data);

            return response()->json([
                "status" => true,
                "message" => "Xóa promotion thành công",
                "data" => $data
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "Đã xảy ra lỗi: " . $e->getMessage()
            ], 500);
        }
    }

    public function check(Request $request){
        try {
            // kiểm tra người dùng 
            $user = auth()->user();
            $promotion = Promotion::where('code', $request->code)->first();
            if($promotion && $promotion->is_active){
                if($user->tier_id == $promotion->tier_id){
                    return response()->json([
                        "status" => true,
                        "message" => "Mã khuyến mãi h��p lệ",
                        "data" => $promotion
                    ], 200);
                } else {
                    return response()->json([
                        "status" => false,
                        "message" => "Voucher này không dành cho bạn !",
                    ], 200);
                }
                
            } else {
                return response()->json([
                    "status" => false,
                    "message" => "Mã khuyến mãi không h��p lệ hoặc đã bị xóa",
                ], 200);
            }
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "Đã xảy ra l��i: ". $e->getMessage()
            ], 500);
        }

    }

//     public function getlistVoucherByUser()
// {
//     try {
//         $user = auth()->user();
//         $tier = $user->tier()->first();
        
//         // Lấy tất cả các mã giảm giá của người dùng theo tier và trạng thái active
//         $promotions = Promotion::where('tier_id', $tier->id)
//             ->where('is_active', true)
//             ->get();
        
//         // Phân loại các mã giảm giá theo loại discount_type và chuyển thành mảng
//         $discountMoney = $promotions->filter(function($promotion) {
//             return $promotion->discount_type === 'money';
//         })->values(); // Chuyển thành mảng

//         $discountPercentage = $promotions->filter(function($promotion) {
//             return $promotion->discount_type === 'percentage';
//         })->values(); // Chuyển thành mảng

//         $discountShipping = $promotions->filter(function($promotion) {
//             return $promotion->discount_type === 'shipping';
//         })->values(); // Chuyển thành mảng

//         // Trả về kết quả dưới dạng hai danh sách riêng biệt
//         return response()->json([
//             'status' => 'success',
//             'data' => [
//                 'discount_money' => $discountMoney,
//                 'discount_percentage' => $discountPercentage,
//                 'discount_shipping' => $discountShipping,
//             ]
//         ]);
//     } catch (\Exception $e) {
//         return response()->json([
//             "status" => "error",
//             "message" => "Đã xảy ra lỗi: ". $e->getMessage()
//         ], 500);
//     }
// }

public function getlistVoucherByUser()
{
    try {
        $user = auth()->user();
        $tier = $user->tier()->first();
        
        // Get all active vouchers for the user based on their tier
        $promotions = Promotion::where('tier_id', $tier->id)
            ->where('is_active', true)
            ->get();

        // Get the order IDs where vouchers have already been used by the user
        $usedOrderIds = Order::where('user_id', $user->id)
            ->whereNotNull('promotion_id')
            ->pluck('promotion_id')
            ->toArray();

        // Filter the promotions by discount type and remove those that have been used
        $discountMoney = $promotions->filter(function($promotion) use ($usedOrderIds) {
            return $promotion->discount_type === 'money' && !in_array($promotion->id, $usedOrderIds);
        })->values(); // Convert to array

        $discountPercentage = $promotions->filter(function($promotion) use ($usedOrderIds) {
            return $promotion->discount_type === 'percentage' && !in_array($promotion->id, $usedOrderIds);
        })->values(); // Convert to array

        $discountShipping = $promotions->filter(function($promotion) use ($usedOrderIds) {
            return $promotion->discount_type === 'shipping' && !in_array($promotion->id, $usedOrderIds);
        })->values(); // Convert to array

        // Return the result as separate lists
        return response()->json([
            'status' => 'success',
            'data' => [
                'discount_money' => $discountMoney,
                'discount_percentage' => $discountPercentage,
                'discount_shipping' => $discountShipping,
            ]
        ]);
    } catch (\Exception $e) {
        return response()->json([
            "status" => "error",
            "message" => "Đã xảy ra lỗi: ". $e->getMessage()
        ], 500);
    }
}


public function checkVoucher(Request $request){
        try {
            // kiểm tra người dùng 
            $user = auth()->user();
            $promotion = Promotion::where('code', $request->code)->first();

            if (!$promotion) {
                return response()->json(['message' => 'Mã giảm giá không hợp lệ.'], 400);
            }

            // Kiểm tra người dùng đã sử dụng mã giảm giá này chưa
            $userHasUsed = Order::where('user_id', $user->id)
                                ->where('promotion_id', $promotion->id)
                                ->exists();

            if ($userHasUsed) {
                return response()->json(['message' => 'Bạn đã sử dụng mã giảm giá này.'], 400);
            }

            // Kiểm tra các điều kiện khác (usage_limit, thời gian, etc.)
            if ($promotion->usage_limit <= $promotion->orders->count()) {
                return response()->json(['message' => 'Mã giảm giá đã hết lượt sử dụng.'], 400);
            }

            if ($promotion->start_date > now() || $promotion->end_date < now()) {
                return response()->json(['message' => 'Mã giảm giá đã hết hạn.'], 400);
            }
            return BaseController::success($promotion);

// // Áp dụng mã giảm giá vào đơn hàng
// $order = new Order();
// $order->user_id = $user->id;
// $order->promotion_id = $promotion->id;
// $order->total_amount = $totalAmount - $discountValue; // Áp dụng giảm giá vào tổng tiền
// $order->save();

        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "Đã xảy ra l��i: ". $e->getMessage()
            ], 500);
        }

    }
}
