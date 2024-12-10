<?php

namespace App\Models;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Auth\Authenticatable;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class User extends Model implements AuthenticatableContract
{
    use Authenticatable;
    use HasApiTokens;
    use HasFactory;

    protected $table = "users";
    protected $primaryKey = 'id'; 
    protected $fillable = [
        'username',
        'password_hash',
        'email',
        'phone',
        'role_id',
        'tier_id',
        'is_active',
        'points_total',
        'total_spent',
    ];
    protected $hidden = [
        'password_hash',
        'remember_token',
    ];
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = bcrypt($value);
    }
     
    public function addresses()
    {
        return $this->hasMany(ShippingAddress::class); // Giả sử 1 người dùng có nhiều địa chỉ
    }

    public function orders(){
        return $this->hasMany(Order::class); // Giả sử 1 người dùng có nhiều đơn hàng
    }

    public function role(){
        return $this->belongsTo(Role::class); // Giả sử 1 người dùng thuộc về 1 vai trò
    }

    public function tier(){
        return $this->belongsTo(Tier::class); // Giả sử 1 người dùng thuộc về 1 tier
    }
   
}