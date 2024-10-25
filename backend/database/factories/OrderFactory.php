<?php

namespace Database\Factories;
use App\Models\User;
use App\Models\Promotion;
use App\Models\ShippingAddress;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
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
            'user_id' => $this->faker->numberBetween(1, 10), // Giả sử có 10 người dùng
            'order_date' => $this->faker->dateTime(),
            'total_amount' => $this->faker->randomFloat(2, 10, 500), // Số tiền tổng trong khoảng từ 10 đến 500
            'promotion_id' => $this->faker->optional()->numberBetween(1, 5), // Giả sử có tối đa 5 khuyến mãi
            'status' => $this->faker->randomElement(['pending', 'completed', 'cancelled']),
            'address_id' => $this->faker->numberBetween(1, 10), // Giả sử có 10 địa chỉ giao hàng
            'payment_method' => $this->faker->randomElement(['credit_card', 'paypal', 'cash']),
            'shipping_cost' => $this->faker->randomFloat(2, 0, 20), // Chi phí giao hàng trong khoảng từ 0 đến 20
    
        ];
    }
}
