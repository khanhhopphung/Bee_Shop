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
            return response()->json(['message' => 'Invalid credentials.'], 401);
        }
    
        // Check if the user account is active
        if (!$user->is_active) {
            return response()->json(['message' => 'Please verify your email.'], 403);
        }
    
        // Create a token for the user
        $token = $user->createToken('authToken')->plainTextToken;
        $user->api_token = $token;
        $user->save();
    
        // Prepare role-specific login logic
        $loginMessage = $user->role_id == 2 
            ? 'Welcome Admin!' 
            : 'Welcome to the client dashboard.';
    
        // Return success response with the token and additional info (role_id, user_id)
        return response()->json([
            'message' => $loginMessage,
            'user_name' => $user->username,
            'access_token' => $token,
            'role_id' => $user->role_id, // Add role_id
            'user_id' => $user->id,      // Add user_id
        ], 200);
    }
    
public function sendOtp(Request $request)
{
    $validator = Validator::make($request->all(), [
        'email' => 'required|email|exists:users,email',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 400);
    }

    $users = User::where('email', $request->email)->first();
    if ($users) {
        // Tạo mã xác nhận OTP
        $otp = random_int(100000, 999999); // Tạo mã OTP 6 chữ số
        $expiresAt = Carbon::now()->addMinutes(10); // Thời gian hết hạn (ví dụ: 10 phút)

        // Lưu mã OTP vào bảng password_resets (hoặc bảng phù hợp)
        \DB::table('password_resets')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => Hash::make($otp),
                'created_at' => now(),
                'expires_at' => $expiresAt,
            ]
        );

        // Gửi mã xác nhận qua email
        Mail::to($request->email)->send(new ResetPasswordMail($otp));

        return response()->json(['message' => 'Mã xác nhận đã được gửi đến email của bạn.']);
    }

    return response()->json(['error' => 'Không tìm thấy người dùng với email này.'], 404);
}



public function resetPassword(Request $request)
{
    $validator = Validator::make($request->all(), [
        'email' => 'required|email|exists:users,email',
        'token' => 'required|string',
        'password' => 'required|string|min:6|confirmed',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 400);
    }

    // Validate the token
    $resetRecord = \DB::table('password_resets')
        ->where('email', $request->email)
        ->first();

    if (!$resetRecord || !Hash::check($request->token, $resetRecord->token)) {
        return response()->json(['message' => 'Invalid or expired token.'], 400);
    }

    // Update the user's password
    $user = User::where('email', $request->email)->first();
    $user->password_hash = Hash::make($request->password);
    $user->save();

    // Delete the password reset record
    \DB::table('password_resets')->where('email', $request->email)->delete();

    return response()->json(['message' => 'Password has been reset successfully.']);
}

}


