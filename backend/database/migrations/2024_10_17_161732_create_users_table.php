<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('username', 255);
            $table->string('password_hash', 255);
            $table->string('email', 255);
            $table->string('phone', 20);
            $table->foreignId('role_id')->constrained('roles');
            $table->foreignId('tier_id')->constrained('tiers');
            $table->boolean('is_active')->default(true);
            $table->integer('points_total')->default(0);
            $table->decimal('total_spent', 5, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
