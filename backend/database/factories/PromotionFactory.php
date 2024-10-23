<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Factory as Faker;

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
        $faker = Faker::create();

        return [
            'code' => strtoupper($faker->lexify('PROMO????')),
            'discount_type' => 'percentage',
            'discount_value' => $faker->randomFloat(2, 5, 50),
            'usage_limit' => $faker->numberBetween(10, 100),
            'start_date' => $faker->dateTimeBetween('-1 month', 'now'),
            'end_date' => $faker->optional()->dateTimeBetween('now', '+2 months'),
            'is_active' => $faker->boolean(80),
            'min_purchase_amount' => $faker->optional()->randomFloat(2, 20, 500),
            'tier_id' => $faker->numberBetween(1, 5), // Assuming you have 5 tiers seeded
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
