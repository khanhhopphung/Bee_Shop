<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tier>
 */
class TierFactory extends Factory
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
            'tier_name' => $this->faker->word,
            'points_required' => $this->faker->numberBetween(1, 1000),
            'discount_tier' => $this->faker->randomFloat(2, 0, 50), // Giảm giá từ 0 đến 50%
            'benefits' => $this->faker->sentence,
        ];
    }
}
