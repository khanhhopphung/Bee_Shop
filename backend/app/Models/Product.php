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
        'price',
        'is_active',
        'created_at',
        'updated_at',
        'deleted_at'
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
        return $this->hasOne(Image::class);
    }

}
