<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWishlistsTable extends Migration
{
    public function up()
    {
        Schema::create('wishlists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Khóa ngoại đến bảng users
            $table->foreignId('product_id')->constrained()->onDelete('cascade'); // Khóa ngoại đến bảng products
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('wishlists');
    }
}

