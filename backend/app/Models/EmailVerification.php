<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class EmailVerification extends Model
{
    use HasFactory;

  
    protected $table = 'email_verifications';

  
    protected $fillable = [
        'email',
        'verification_code',
        'expires_at',
    ];

    // Chuyển đổi kiểu của trường expires_at sang Carbon để dễ làm việc với ngày giờ
    protected $dates = ['expires_at'];

    // Hàm để kiểm tra xem mã xác nhận đã hết hạn chưa
    public function isExpired()
    {
        return Carbon::now()->greaterThan($this->expires_at);
    }
}
