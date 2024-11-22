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
    public function products()
    {
        return $this->belongsTo(Product::class);
    }

     

    public function product_variants()
    {
        return $this->belongsTo(ProductVariant::class);
    }
    
}
