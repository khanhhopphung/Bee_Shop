<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductVarian;
use App\Models\Size; // Nếu bạn có model Size
use App\Models\Color; // Nếu bạn có model Color
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductVarianFactory extends Factory
{
    protected $model = ProductVarian::class;

    public function definition(): array
    {
        return [
            'product_id' => Product::factory(), // Giả sử bạn đã có ProductFactory
            'size_id' => Size::factory(), // Giả sử bạn đã có SizeFactory
            'color_id' => Color::factory(), // Giả sử bạn đã có ColorFactory
            'price' => $this->faker->randomFloat(2, 10, 1000),
            'stock' => $this->faker->numberBetween(1, 100),
            'is_active' => $this->faker->boolean(),
        ];
    }
}
