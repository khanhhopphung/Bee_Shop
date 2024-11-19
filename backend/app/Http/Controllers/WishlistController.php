<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{

   
    // Thêm sản phẩm vào danh sách yêu thích
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        Wishlist::firstOrCreate([
            'user_id' => auth()->id(),
            'product_id' => $request->product_id,
        ]);

        return response()->json(['message' => 'Product added to wishlist!']);
    }

    // Xóa sản phẩm khỏi danh sách yêu thích
    public function destroy($id)
    {
        $wishlist = Wishlist::where('user_id', auth()->id())->where('product_id', $id)->first();

        if ($wishlist) {
            $wishlist->delete();
            return response()->json(['message' => 'Product removed from wishlist!']);
        }

        return response()->json(['message' => 'Product not found in wishlist!'], 404);
    }

    // Lấy danh sách yêu thích của người dùng
    public function index()
    {
        $wishlists = Wishlist::with('product')->where('user_id', auth()->id())->get();

        return response()->json($wishlists);
    }
}

