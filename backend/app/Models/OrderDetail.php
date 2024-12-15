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
        'price',
    ];
    public function orders()
    {
        return $this->belongsTo(Order::class);
    }
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }



    public function product_variant()
    {
        return $this->belongsTo(ProductVariant::class, 'variant_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'product_id', 'product_id')
            ->where('order_id', $this->order_id); // Lấy order_id từ order detail
    }
}
