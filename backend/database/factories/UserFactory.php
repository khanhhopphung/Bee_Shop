<?php

namespace Database\Factories;

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
           'username' => $this->faker->unique()->userName,
            'password_hash' => Hash::make('password'), // Mã hóa password
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->phoneNumber,
            'role_id' => $this->faker->numberBetween(1, 10), // Giả sử có 10 role
            'tier_id' => $this->faker->numberBetween(1, 10), // Giả sử có 10 tier
            'is_active' => $this->faker->boolean,
            'points_total' => $this->faker->numberBetween(0, 1000),
            'total_spent' => $this->faker->randomFloat(2, 0, 1000),
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
