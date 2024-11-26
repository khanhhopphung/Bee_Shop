<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
class Blog extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'content', 'category_id', 'image', 'is_active'];


    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Accessor để lấy URL đầy đủ của ảnh
    public function getImageUrlAttribute()
    {
        return $this->image ? Storage::url($this->image) : null;
    }
}
