<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\BaseController;
use App\Models\Cart;
use App\Http\Requests\StoreCartRequest;
use App\Http\Requests\UpdateCartRequest;
use App\Models\CartDetail;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\Auth;
class CartController extends BaseController
{
    public function addToCart(Request $request)
    {
        try{
        if (Auth::check()) {
            // return Auth::user();

        $cart = Cart::firstOrCreate([
            'user_id' => auth()->id()
        ]);

        $variant_id = ProductVariant::where('size_id', $request->size_id)->where('color_id', $request->color_id)->first();
        if (!$variant_id) {
            return $this->error('Not Found');
            // $variant_id = ProductVariant::create([
            //     'product_id' => $request->product_id,
            //     'color_id' => $request->color_id,
            //     'size_id' => $request->size_id

            // ])->id;
        };

        $cartDetail = $cart->cartDetails()->create([
            'product_id' => $request->product_id,
            'quantity' => $request->quantity,
            'product_price' => Product::find($request->product_id)->price,
            'variant_id'=> $variant_id->id,
            'discount_value' => $request->discount_value ?? 0,
        ]);

        return $this->success($cartDetail) ;
        } else {
            return "Người dùng chưa đăng nhập";
        }
    } catch (\Exception $e) {
        return $this->error($e->getMessage());
    }
        
       
    }

    // Xem giỏ hàng
    public function viewCart()
    {
        $cart = Cart::with('cartDetails.product')->where('user_id', auth()->id())->first();
return $this->success($cart) ;
    }

    // Xóa sản phẩm khỏi giỏ hàng
    public function removeFromCart($id)
    {
        $cartDetail = CartDetail::findOrFail($id);
        $cartDetail->delete();
return $this->success($cartDetail) ;
    }
}
