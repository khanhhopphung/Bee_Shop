<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Color>
 */
class ColorFactory extends Factory
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
            'color_name' => $this->faker->colorName(), // Tạo tên màu ngẫu nhiên
            'is_active' => $this->faker->boolean(), // Tạo giá trị true/false ngẫu nhiên
            'created_at' => now(), // Thời gian tạo
            'updated_at' => now(), // Thời gian cập nhật
        ];
    }
}
