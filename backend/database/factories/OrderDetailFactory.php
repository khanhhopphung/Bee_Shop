<?php

namespace Database\Factories;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVarian;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderDetail>
 */
class OrderDetailFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            //
            'order_id' => Order::inRandomOrder()->first()->id, // Giả sử có 10 đơn hàng
            'product_id' => Product::inRandomOrder()->first()->id, // Giả sử có 20 sản phẩm
            'variant_id' => ProductVarian::inRandomOrder()->first()->id, // Giả sử có 20 biến thể sản phẩm
            'quantity' => $this->faker->numberBetween(1, 5), // Số lượng từ 1 đến 5
            'price' => $this->faker->randomFloat(2, 10, 100), // Giá từ 10 đến 100
        ];
    }
}
