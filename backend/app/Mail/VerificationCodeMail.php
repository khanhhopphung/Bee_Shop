<?php

// app/Mail/VerificationCodeMail.php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VerificationCodeMail extends Mailable
{
    use Queueable, SerializesModels;

    public $username;
    public $verificationCode;

    public function __construct($username, $verificationCode)
    {
        $this->username = $username;
        $this->verificationCode = $verificationCode;
    }

    public function build()
    {
        return $this->subject('Mã xác nhận tài khoản')
                    ->view('emails.verification_code')
                    ->with([
                        'username' => $this->username,
                        'verificationCode' => $this->verificationCode,
                    ]);
    }
}
