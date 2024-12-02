<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddStatusToOrders extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            // Thêm trạng thái mới vào cột status
            $table->enum('status', [
                'pending',
                'completed',
                'cancelled',
                'processing',  // Trạng thái mới
                'shipped',     // Trạng thái mới
                'delivered',   // Trạng thái mới
                'returned',    // Trạng thái mới
                'refunded',    // Trạng thái mới
                'on_hold'      // Trạng thái mới
            ])->default('pending')->change(); // Đảm bảo giá trị mặc định là 'pending'
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            // Khôi phục lại cột status nếu cần
            $table->enum('status', [
                'pending',
                'completed',
                'cancelled'
            ])->default('pending')->change();
        });
    }
}
