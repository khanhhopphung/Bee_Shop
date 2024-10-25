<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartDetail extends Model
{
    use HasFactory;

    protected $fillable = ['cart_id', 'product_id', 'variant_id', 'quantity', 'product_price', 'discount_value'];

    // Liên kết với cart
    public function cart()
    {
        return $this->belongsTo(Cart::class, 'cart_id', 'id');
    }

    // Liên kết với product
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }
}
