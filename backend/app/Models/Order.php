<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'order_date',
        'total_amount',
        'promotion_id',
        'status',
        'address_id',
        'payment_method',
        'shipping_cost',
        'order_code',
        'name', 
        'phone', 
        'address',
        'is_active',
    ];
    public function users()
    {
        return $this->belongsTo(User::class);
    }
    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class);
    }

    public function address()
    {
        return $this->belongsTo(ShippingAddress::class,'address_id');
    }

}
