<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    use HasFactory;
    protected $fillable = [
        'product_id',
        'variant_id',
        'image_url',
        'alt_text',
        'is_active',
        'created_at',
        'updated_at',
    ];
}
