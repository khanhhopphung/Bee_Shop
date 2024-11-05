<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\ResetPasswordMail;

use App\Models\User;
use App\Mail\VerificationCodeMail;
use App\Models\EmailVerification;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request){
        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'phone' => $request->phone,
            'password_hash' => Hash::make($request->password_hash),
            'is_active' => false,
            'role_id' => 1,  
            'tier_id' => 1,  
    
        ]);
    
        // Generate verification code
        $verificationCode = Str::random(6);
        $expiresAt = Carbon::now()->addMinutes(30);
    
        // Store verification code
        EmailVerification::create([
            'email' => $request->email,
            'verification_code' => $verificationCode,
            'expires_at' => $expiresAt,
        ]);
    
        // Send verification email
        Mail::to($user->email)->send(new VerificationCodeMail($user->username, $verificationCode));
    
        return response()->json(['message' => 'Đăng ký thành công, vui lòng kiểm tra email để lấy mã xác nhận.']);
    }
    public function logout(Request $request)
{
    // Xóa token hiện tại của người dùng
    $request->user()->tokens()->delete();

    // Trả về phản hồi thành công
    return response()->json(['message' => 'Logout successful.'], 200);
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
        return response()->json(['message' => 'Invalid credentials.'], 401);
    }

    // Check if the user account is active
    if (!$user->is_active) {
        return response()->json(['message' => 'Please verify your email.'], 403);
    }

    // Create a token for the user
    $token = $user->createToken('authToken')->plainTextToken;

    // Return success response with the token
    return response()->json([
        'message' => 'Login successful.', // Success message
        'access_token' => $token
    ], 200);
    }
}