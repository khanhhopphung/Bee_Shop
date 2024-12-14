<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPromotionsToOrdersTable extends Migration
{
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('discount_promotion_id')->nullable()->constrained('promotions');
            $table->foreignId('shipping_promotion_id')->nullable()->constrained('promotions');
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('shipping_discount', 10, 2)->default(0);
            $table->decimal('final_amount', 10, 2)->default(0)->after('shipping_cost');
        });
    }

    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['discount_promotion_id']);
            $table->dropForeign(['shipping_promotion_id']);
            $table->dropColumn(['discount_promotion_id', 'shipping_promotion_id', 'discount_amount', 'shipping_discount', 'final_amount']);
        });
    }
}
