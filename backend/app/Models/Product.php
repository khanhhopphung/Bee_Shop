<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;


    protected $fillable = [
        'name',
        'sku',
        'description',
        'category_id',
        'stock',
        // 'price',
        'is_active',
        'created_at',
        'updated_at',
        'deleted_at',
        
        
    ];

   
    protected $casts = [
        'price' => 'integer',
        'is_available' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];



    public function category()
    {
        return $this->belongsTo(Category::class);
    }


    public function image(){
        return $this->hasone(Image::class);
    }

    public function reviews(){
        return $this->hasMany(Review::class);
    }


    public function productvariants(){
        return $this->hasMany(ProductVariant::class);
    }

    public function size()
    {
        return $this->hasMany(Size::class);
    }

    public function color()
    {
        return $this->hasMany(Color::class);
    }
    public function orders()
    {
        return $this->hasMany(order::class);
    }

    public function orderDetails()

{
    return $this->hasMany(OrderDetail::class, 'product_id', 'id');
}



}
