<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoriesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

     protected $model = Category::class;

     public function definition(): array
     {
         $data = [
             'name' => $this->faker->word,
             'sku' => $this->faker->unique()->word,
             'parent_category_id' => null, // Hoặc có thể chỉ định một ID hợp lệ nếu bạn đã có danh mục
             'is_active' => $this->faker->boolean,
             'image_url' => $this->faker->imageUrl(640, 480, 'categories', true),
         ];
 
         dd($data); // Kiểm tra dữ liệu được tạo ra
         return $data;
     }
}
