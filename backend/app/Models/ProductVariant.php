<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    use HasFactory;
    protected $fillable = [
        'product_id',
        'size_id',
        'color_id',
        'price',
        'stock',
        'is_active',
        'created_at',
        'updated_at',
        'deleted_at'
    ];
    protected $table = 'product_variants';

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

        public function size()
    {
        return $this->belongsTo(Size::class);
    }

    public function color()
    {
        return $this->belongsTo(Color::class);
    }
}

