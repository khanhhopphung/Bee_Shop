<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
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
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}