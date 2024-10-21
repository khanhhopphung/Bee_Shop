<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
   protected $model = Category::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->word, // Tạo tên danh mục ngẫu nhiên
            'sku' => $this->faker->unique()->word, // Tạo SKU duy nhất
            'parent_category_id' => null, // Hoặc có thể chỉ định một ID hợp lệ nếu bạn đã có danh mục
            'is_active' => $this->faker->boolean, // Tạo giá trị ngẫu nhiên cho trạng thái
            'image_url' => $this->faker->imageUrl(640, 480, 'categories', true), // Tạo URL hình ảnh ngẫu nhiên
        ];
    }
}
