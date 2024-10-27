<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Factory as Faker;

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
        $faker = Faker::create();
        return [
            
            'tier_name' => $faker->word,
                'points_required' => $faker->numberBetween(100, 1000),
                'discount_tier' => $faker->randomFloat(2, 5, 30),
                'benefits' => $faker->sentence(6),
                'created_at' => now(),
                'updated_at' => now(),
        ];
    }
}
