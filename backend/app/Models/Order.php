<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',         // Thêm user_id vào fillable
        'order_date',
        'total_amount',
        'promotion_id',
        'status',
        'address_id',
        'payment_method',
        'shipping_cost'
    ];

    // Liên kết với order_details
    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class, 'order_id', 'id');
    }
}
