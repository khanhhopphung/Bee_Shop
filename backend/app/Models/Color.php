<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Color extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'color_name',
        'is_active',
        'create_at',
        'update_at',
        
    ];
}
