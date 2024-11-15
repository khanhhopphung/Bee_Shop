<?php

namespace Database\Factories;

use App\Models\Image;
use App\Models\Product;
use App\Models\ProductVarian;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Image>
 */
class ImageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Image::class;
    public function definition(): array
    {
        
        return [
            'product_id' => Product::factory(), 
            'variant_id' => $this->faker->optional()->randomElement(ProductVarian::pluck('id')),
            'alt_text' => $this->faker->sentence(), 
            'image_url' => $this->faker->imageUrl(640, 480, 'products'), 
            'is_active' => $this->faker->boolean(), 
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
