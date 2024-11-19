<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wishlist extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'product_id'];

    // Mối quan hệ với người dùng
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Mối quan hệ với sản phẩm
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}