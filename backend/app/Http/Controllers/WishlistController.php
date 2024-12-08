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
    $wishlists = Wishlist::with('product.productVariants.images') // Liên kết với các biến thể sản phẩm và hình ảnh
        ->where('user_id', auth()->id())
        ->get();

    // Tính toán giá min và max cho mỗi sản phẩm trong danh sách yêu thích
    $wishlists->map(function ($wishlist) {
        $product = $wishlist->product;
        
        if ($product) {
            // Tính giá tối đa và tối thiểu của sản phẩm dựa trên các biến thể sản phẩm
            $product['price_max'] = $product->productVariants->max('price');
            $product['price_min'] = $product->productVariants->min('price');

            // Lấy thông tin hình ảnh của sản phẩm
            $image = $product->image()->first();
            $product['image_url'] = $image ? $image->image_url : null;
            $product['alt_text'] = $image ? $image->alt_text : null;
        }

        return $wishlist;
    });

    return response()->json($wishlists);
}

}

