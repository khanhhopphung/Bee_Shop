<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',       
        'product_id',
        'variant_id',
        'quantity',
        'price'
    ];

    // Liên kết với bảng orders
    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id', 'id');
    }

    // Liên kết với bảng products
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }

    // Liên kết với bảng product_variants
    public function variant()
    {
        return $this->belongsTo(ProductVarian::class, 'variant_id', 'id');
    }
}
