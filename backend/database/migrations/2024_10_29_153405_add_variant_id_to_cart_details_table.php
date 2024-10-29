<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddVariantIdToCartDetailsTable extends Migration
{
    public function up()
    {
        Schema::table('cart_details', function (Blueprint $table) {
            $table->unsignedBigInteger('variant_id')->nullable()->after('product_id');
        });
    }

    public function down()
    {
        Schema::table('cart_details', function (Blueprint $table) {
            $table->dropColumn('variant_id');
        });
    }
}
