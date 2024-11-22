<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateProductsTableAddSizeColor extends Migration
{
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {
            // Kiểm tra và thêm các cột nếu chưa tồn tại
            if (!Schema::hasColumn('products', 'size_id')) {
                $table->unsignedBigInteger('size_id')->nullable()->after('stock');
            }
            if (!Schema::hasColumn('products', 'color_id')) {
                $table->unsignedBigInteger('color_id')->nullable()->after('size_id');
            }
        });
    }

    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'size_id')) {
                $table->dropColumn('size_id');
            }
            if (Schema::hasColumn('products', 'color_id')) {
                $table->dropColumn('color_id');
            }
        });
    }
}
