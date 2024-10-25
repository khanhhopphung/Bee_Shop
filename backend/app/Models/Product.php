<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
<<<<<<< HEAD

=======
>>>>>>> origin/fix-dev
    protected $fillable = [
        'name',
        'sku',
        'description',
        'category_id',
        'stock',
        'price',
        'is_active',
<<<<<<< HEAD
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
=======
        'created_at',
        'updated_at',
        'deleted_at'
    ];
>>>>>>> origin/fix-dev
}
