<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ShippingAddress>
 */
class ShippingAddressFactory extends Factory
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
            'user_id' => rand(1,10), // Tạo liên kết với một user
            'recipient_name' => $this->faker->name,
            'phone' => $this->faker->phoneNumber,
            'address_line' => $this->faker->address,
            'city' => $this->faker->city,
            'state' => $this->faker->state,
            'is_default' => $this->faker->boolean(80), // 80% khả năng là true
        ];
    }
}
