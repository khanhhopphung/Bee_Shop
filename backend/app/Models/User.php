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
     
   
}