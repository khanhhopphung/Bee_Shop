<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Http\Requests\StoreCartRequest;
use App\Http\Requests\UpdateCartRequest;
use App\Models\CartDetail;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends BaseController
{
    public function addToCart(Request $request)
    {
        $cart = Cart::firstOrCreate([
            'user_id' => auth()->id()
        ]);

        $cartDetail = $cart->cartDetails()->create([
            'product_id' => $request->product_id,
            'quantity' => $request->quantity,
            'product_price' => Product::find($request->product_id)->price,
            'discount_value' => $request->discount_value ?? 0,
        ]);

        return $this->success($cartDetail) ;
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
