<?php

namespace Database\Seeders;

use App\Models\CartDetail;
use App\Models\Cart;
use App\Models\Product;
use App\Models\ProductVarian;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CartDetailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        
        // Giả sử chúng ta có một giỏ hàng đã tạo cho người dùng
        $cart = Cart::first(); // Lấy giỏ hàng đầu tiên hoặc bạn có thể tạo mới

        // Lấy các sản phẩm và biến thể
        $products = Product::all();
        $productVariants = ProductVarian::all();

        foreach ($products as $product) {
            foreach ($productVariants as $variant) {
                CartDetail::create([
                    'cart_id' => $cart->id, // ID giỏ hàng
                    'product_id' => $product->id,
                    'variant_id' => $variant->id, // ID biến thể
                    'quantity' => rand(1, 5), // Số lượng ngẫu nhiên
                    'product_price' => $variant->price, // Giá từ biến thể
                    'discount_value' => null, // Có thể thêm giá trị giảm giá nếu cần
                ]);
            }
        }
    }
        
}
