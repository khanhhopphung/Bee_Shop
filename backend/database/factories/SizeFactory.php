<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Size>
 */
class SizeFactory extends Factory
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
            'size_name' => $this->faker->word(),  // Tên kích thước ngẫu nhiên
            'is_active' => $this->faker->boolean(), // Trạng thái ngẫu nhiên (true/false)
            'created_at' => now(), // Thời gian tạo hiện tại
            'updated_at' => now(),
        ];
    }
}
