<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Promotion>
 */
class PromotionFactory extends Factory
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
            'code' => 'PROMO_' . strtoupper($this->faker->unique()->lexify('?????')), // Tạo mã khuyến mãi ngẫu nhiên
            'discount_type' => 'percentage', // Có thể mở rộng nếu có loại giảm giá khác
            'discount_value' => $this->faker->randomFloat(2, 5, 50), // Giảm giá từ 5.00 đến 50.00
            'usage_limit' => $this->faker->numberBetween(1, 100), // Giới hạn sử dụng từ 1 đến 100
            'start_date' => $this->faker->dateTimeBetween('now', '+1 month'), // Ngày bắt đầu từ bây giờ đến 1 tháng sau
            'end_date' => $this->faker->dateTimeBetween('+1 month', '+2 months'), // Ngày kết thúc từ 1 đến 2 tháng sau
            'is_active' => $this->faker->boolean(80), // 80% khả năng là true
            'min_purchase_amount' => $this->faker->optional()->randomFloat(2, 20, 200), // Giá trị mua tối thiểu
            'tier_id' => rand(1,10),
        ];
    }
}
