<?php

namespace Database\Seeders;

use App\Models\ProductVarian;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductVarianSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ProductVarian::factory()->count(5)->create(); // Tạo 10 biến thể sản phẩm
    }
}
