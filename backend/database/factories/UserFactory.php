<?php

namespace Database\Factories;

use App\Models\Role;
use App\Models\Tier;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'username' => $this->faker->userName,
            'password_hash' => Hash::make('password'),  // You can replace 'password' with a random value if needed
            'email' => $this->faker->unique()->safeEmail,
            'phone' => $this->faker->phoneNumber,
            'role_id' => Role::inRandomOrder()->first()->id,
            'tier_id' => Tier::inRandomOrder()->first()->id,
            'is_active' => $this->faker->boolean,
            'points_total' => $this->faker->numberBetween(0, 1000),
            'total_spent' => $this->faker->randomFloat(2, 0, 999.99),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
