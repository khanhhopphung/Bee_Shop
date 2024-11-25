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
        'deleted_at',
        'size_id',
        'color_id',
        
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
<<<<<<< HEAD
    
=======
    public function size()
    {
        return $this->hasMany(Size::class);
    }

    public function color()
    {
        return $this->hasMany(Color::class);
    }
>>>>>>> 9e46b7a74fd9c0a4d786d6676144f5539d985831

}
