<?php

namespace App\Http\Controllers\API;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\BaseController;
use App\Models\Cart;
use App\Http\Requests\StoreCartRequest;
use App\Http\Requests\UpdateCartRequest;
use App\Models\CartDetail;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;


use App\Models\ProductVariant;

use Illuminate\Support\Facades\Auth;
class CartController extends BaseController
{
//     public function addToCart(Request $request)
// {
//     try {
//         // Kiểm tra các tham số cần thiết
//         if (!$request->product_id || !$request->size_id || !$request->color_id || !$request->quantity) {
//             return response()->json([
//                 'message' => 'Thiếu tham số cần thiết',
//                 'data' => $request
//             ], 400);
//         }
        

//         // Bắt đầu giao dịch
//         DB::transaction(function () use ($request) {
//             // Kiểm tra xem người dùng đã đăng nhập chưa
//             if (Auth::check()) {
//                 // Tìm hoặc tạo giỏ hàng cho người dùng
//                 $cart = Cart::firstOrCreate([
//                     'user_id' => auth()->id()
//                 ]);

                

//                 // Kiểm tra xem sản phẩm có biến thể (size, color) hợp lệ không
//                 $variant = ProductVariant::where('size_id', $request->size_id)
//                     ->where('color_id', $request->color_id)->where('product_id', $request->product_id)
//                     ->first();
//                 if (!$variant) {
//                     echo "ru n";
//                     // Trả về lỗi nếu không tìm thấy biến thể
//                     return response()->json([
//                         'status' => false,
//                         'message' => 'Product_variant not Found',
//                     ], HttpResponse::HTTP_BAD_REQUEST);
//                 }

                

//                 // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
//                 $cartDetails = $cart->cartDetails()->get(); // Sử dụng get() để lấy tất cả chi tiết giỏ hàng
//                 $existingCartDetail = null;

//                 foreach ($cartDetails as $cartDetail) {
//                     // Kiểm tra nếu sản phẩm và biến thể đã có trong giỏ
//                     if ($cartDetail->product_id == $request->product_id && $cartDetail->variant_id == $variant->id) {
//                         $existingCartDetail = $cartDetail;
//                         break;  // Nếu tìm thấy, thoát khỏi vòng lặp
//                     }
//                 }
                
//                 if ($existingCartDetail) {
//                     // Nếu đã có chi tiết giỏ hàng, cập nhật số lượng
//                     $existingCartDetail->quantity += $request->quantity;
//                     $existingCartDetail->save(); // Lưu lại thay đổi
                    
//                 } else {
//                     // Nếu chưa có, tạo chi tiết giỏ hàng mới
//                     $cart->cartDetails()->create([
//                         'product_id' => $request->product_id,
//                         'quantity' => $request->quantity,
//                         'product_price' => Product::find($request->product_id)->price,
//                         'variant_id' => $variant->id,
//                         'discount_value' => $request->discount_value ?? 0,
//                     ]);
//                 }
                

//                 // Trả về kết quả thành công
//                 return $this->success(null,"ok  "); // Trả về chi tiết giỏ hàng mới nhất
//             } else {
//                 // Trả về lỗi nếu người dùng chưa đăng nhập
//                 return response()->json(['message' => 'Người dùng chưa đăng nhập'], 401);
//             }
//         });

//     } catch (\Exception $e) {
//         // Xử lý ngoại lệ và trả về thông báo lỗi chi tiết
//         return response()->json([
//             'message' => $e->getMessage(),
//             'code' => $e->getCode(),
//             'file' => $e->getFile(),
//             'line' => $e->getLine(),
//         ], 500);
//     }
// }

public function addToCart(Request $request)
{
    try {
        

        if (!Auth::check()) {
            return response()->json(['message' => 'Người dùng chưa đăng nhập'], 401);
        }

        $product = Product::find($request->product_id);
        if (!$product) {
            return response()->json(['message' => 'Sản phẩm không tồn tại'], 404);
        }

        $variant = ProductVariant::where([
            'size_id' => $request->size_id,
            'color_id' => $request->color_id,
            'product_id' => $request->product_id,
        ])->first();

        if (!$variant) {
            return response()->json(['message' => 'Biến thể sản phẩm không tồn tại'], 400);
        }

        DB::transaction(function () use ($request, $variant, $product) {
            $cart = Cart::firstOrCreate(['user_id' => auth()->id()]);

            $existingCartDetail = $cart->cartDetails()->where([
                'product_id' => $request->product_id,
                'variant_id' => $variant->id,
            ])->first();

            if ($existingCartDetail) {
                $existingCartDetail->quantity += $request->quantity;
                $existingCartDetail->save();
            } else {
                $cart->cartDetails()->create([
                    'product_id' => $request->product_id,
                    'quantity' => $request->quantity,
                    'product_price' => $variant->price,
                    'variant_id' => $variant->id,
                    'discount_value' => $request->discount_value ?? 0,
                ]);
            }
        });

        return response()->json(['message' => 'Sản phẩm đã được thêm vào giỏ hàng'], 200);

    } catch (\Exception $e) {
        return response()->json([
            'message' => $e->getMessage(),
            'code' => $e->getCode(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
        ], 500);
    }
}



    // Xem giỏ hàng
    public function viewCart()
    {
        $cart = Cart::with('cartDetails.product.image','cartDetails.productVariant.color','cartDetails.productVariant.size')->where('user_id', auth()->id())->first();
return $this->success($cart) ;
    }

    // Xóa sản phẩm khỏi giỏ hàng
    public function removeFromCart($id)
    {
        $cartDetail = CartDetail::findOrFail($id);
        $cartDetail->delete();
return $this->success($cartDetail) ;
    }

    public function deleteCart(string $id){
        $cartDetail = CartDetail::findOrFail($id);
        $cartDetail->delete();
        return $this->success($cartDetail) ;
        
    }

    public function deleteCarts(Request $request ){
       CartDetail::whereIn('id',$request->ids )->delete();
       return $this->success() ;
    }
    public function updateQuantity(Request $request, $id)
{
    try {
        // Kiểm tra nếu người dùng đã đăng nhập
        if (!Auth::check()) {
            return response()->json(['message' => 'Người dùng chưa đăng nhập'], 401);
        }

        // Kiểm tra xem có truyền tham số quantity không
        if (!$request->has('quantity')) {
            return response()->json(['message' => 'Thiếu tham số số lượng'], 400);
        }

        // Tìm chi tiết giỏ hàng dựa trên id
        $cartDetail = CartDetail::findOrFail($id);

        // Cập nhật số lượng mới
        $newQuantity = $request->input('quantity');

        // Kiểm tra nếu số lượng là hợp lệ
        if ($newQuantity < 1) {
            return response()->json(['message' => 'Số lượng phải lớn hơn hoặc bằng 1'], 400);
        }

        $cartDetail->quantity = $newQuantity;
        $cartDetail->save();

        return $this->success($cartDetail, "Số lượng đã được cập nhật!");
    } catch (\Exception $e) {
        return response()->json([
            'message' => $e->getMessage(),
            'code' => $e->getCode(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
        ], 500);
    }
}


}

