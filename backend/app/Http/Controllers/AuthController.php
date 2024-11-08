<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\ResetPasswordMail;
use Illuminate\Validation\ValidationException;

use App\Models\User;
use App\Mail\VerificationCodeMail;
use App\Models\EmailVerification;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // Validate dữ liệu người dùng nhập vào
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:255|unique:users,username',
            'email' => 'required|email|max:255|unique:users,email',
            'phone' => 'required|string|max:15|unique:users,phone',
            'password_hash' => 'required|string|min:6|confirmed', // Xác nhận mật khẩu
        ]);
    
        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
    
        // Tạo người dùng mới
        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'phone' => $request->phone,
            'password_hash' => Hash::make($request->password_hash),
            'is_active' => false,
            'role_id' => 1,
            'tier_id' => 1,
        ]);
    
        // Tạo mã xác nhận
        $verificationCode = Str::random(6);
        $expiresAt = Carbon::now()->addMinutes(30);
    
        // Lưu mã xác nhận
        EmailVerification::create([
            'email' => $request->email,
            'verification_code' => $verificationCode,
            'expires_at' => $expiresAt,
        ]);
    
        // Gửi email xác nhận
        Mail::to($user->email)->send(new VerificationCodeMail($user->username, $verificationCode));
    
        return response()->json(['message' => 'Đăng ký thành công, vui lòng kiểm tra email để lấy mã xác nhận.']);
    }
    public function logout(Request $request)
{
    try{
    // Xóa token hiện tại của người dùng
    $request->user()->tokens()->delete();

    // Trả về phản hồi thành công
    return response()->json(['message' => 'Logout successful.'], 200);
    } catch (\Exception $e) {
        return response()->json(['message' => $e->getMessage(),$e->getFile(), $e->getLine()], 500);
    }
}
    public function verifyEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'verification_code' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $verification = EmailVerification::where('email', $request->email)
            ->where('verification_code', $request->verification_code)
            ->first();

        if (!$verification || Carbon::now()->greaterThan($verification->expires_at)) {
            return response()->json(['message' => 'Invalid or expired verification code.'], 400);
        }

        // Activate user
        $user = User::where('email', $request->email)->first();
        if ($user) {
            $user->is_active = true;
            $user->email_verified_at = Carbon::now();
            $user->save();

            // Delete verification record
            $verification->delete();

            return response()->json(['message' => 'Email verified successfully.']);
}

        return response()->json(['message' => 'User not found.'], 404);
    }

    public function login(Request $request)
{
    // Validate the incoming request data
    $validator = Validator::make($request->all(), [
        'username' => 'required|string',
        'password' => 'required|string',
    ]);

    // Return validation errors if any
    if ($validator->fails()) {
        return response()->json($validator->errors(), 400);
    }

    // Find the user by username
    $user = User::where('username', $request->username)->first();

    // Check if the user exists and if the password matches
    if (!$user || !Hash::check($request->password, $user->password_hash)) {
        return response()->json(['message' => 'Tài khoản hoặc mật khẩu không chính xác! Vui lòng thử  lại'], 401);
    }

    // Check if the user account is active
    if (!$user->is_active) {
        return response()->json(['message' => 'Please verify your email.'], 403);
    }

    // Create a token for the user
    $token = $user->createToken('authToken')->plainTextToken;
    $user->api_token = $token;
    $user->save();
    // Return success response with the token
    return response()->json([
        'message' => 'Login successful.', 
        'user_name' => $user->username,
        'access_token' => $token
    ], 200);
}
}