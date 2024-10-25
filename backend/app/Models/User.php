<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    use HasFactory;
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
   

    public function roles()
    {
        return $this->belongsTo(Role::class);
    }

        public function tier()
    {
        return $this->belongsTo(Tier::class);
    }

}
