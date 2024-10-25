<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Review>
 */
class ReviewFactory extends Factory
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
            'user_id' => rand(1,10), // Tạo người dùng mới nếu cần
            'product_id' => rand(1,10), // Tạo sản phẩm mới nếu cần
            'comment' => $this->faker->sentence(),
            'rating' => $this->faker->numberBetween(1, 5), // Đánh giá từ 1 đến 5
            'review_date' => $this->faker->dateTime(),
            'is_verified' => $this->faker->boolean(50), // 50% khả năng là true
        ];
    }
}
