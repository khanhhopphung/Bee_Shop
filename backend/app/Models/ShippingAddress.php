<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingAddress extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'recipient_name',
        'phone',
        'address_line',
        'city',
        'state',
        'is_active',
        'is_default',
    ];

    // Định nghĩa quan hệ với model User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
