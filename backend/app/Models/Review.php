<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'product_id',
        'comment',
        'rating',
        'review_date',
        'is_verified',
        'image',
    ];

    // Thiết lập mối quan hệ với User
    // public function user()
    // {
    //     return $this->belongsTo(User::class);
    // }
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    
    // Thiết lập mối quan hệ với Product
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
