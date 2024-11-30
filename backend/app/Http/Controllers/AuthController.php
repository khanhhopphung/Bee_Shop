<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\ResetPasswordMail;
use App\Http\Requests\StoreUserRequest;
use App\Models\User;
use App\Mail\VerificationCodeMail;
use App\Models\EmailVerification;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    // Đăng ký người dùng mới
    public function register(StoreUserRequest $request)
    {
        // Kiểm tra nếu email đã tồn tại
        if (User::where('email', $request->email)->exists()) {
            return response()->json(['message' => 'Email đã được sử dụng.'], 400);
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

        // Tạo mã xác minh
        $verificationCode = Str::random(6);
        $expiresAt = Carbon::now()->addMinutes(30);

        // Lưu mã xác minh vào bảng EmailVerification
        EmailVerification::create([
            'email' => $request->email,
            'verification_code' => $verificationCode,
            'expires_at' => $expiresAt,
        ]);

        // Gửi email xác minh
        Mail::to($user->email)->send(new VerificationCodeMail($user->username, $verificationCode));

        return response()->json(['message' => 'Đăng ký thành công, vui lòng kiểm tra email để lấy mã xác nhận.']);
    }

    // Đăng xuất người dùng
    public function logout(Request $request)
    {
        try {
            // Xóa token hiện tại của người dùng
            $request->user()->tokens()->delete();

            return response()->json(['message' => 'Logout successful.'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Có lỗi xảy ra: ' . $e->getMessage()], 500);
        }
    }

    // Xác minh email người dùng
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
            return response()->json(['message' => 'Mã xác minh không hợp lệ hoặc đã hết hạn.'], 400);
        }

        // Kích hoạt người dùng
        $user = User::where('email', $request->email)->first();
        if ($user) {
            $user->is_active = true;
            $user->email_verified_at = Carbon::now();
            $user->save();

            // Xóa mã xác minh sau khi xác thực thành công
            $verification->delete();

            return response()->json(['message' => 'Xác minh email thành công.']);
        }

        return response()->json(['message' => 'Người dùng không tìm thấy.'], 404);
    }

    // Đăng nhập người dùng
    public function login(Request $request)
{
    $validator = Validator::make($request->all(), [
        'username' => 'required|string',
        'password' => 'required|string',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 400);
    }

    // Tìm user bằng username hoặc email
    $user = User::where('username', $request->username)
                ->orWhere('email', $request->username)
                ->first();

    if (!$user || !Hash::check($request->password, $user->password_hash)) {
        return response()->json(['message' => 'Thông tin đăng nhập không chính xác.'], 401);
    }

    if (!$user->is_active) {
        return response()->json(['message' => 'Vui lòng xác minh email trước khi đăng nhập.'], 403);
    }

    $token = $user->createToken('authToken')->plainTextToken;
    $user->api_token = $token;
    $user->save();

    $loginMessage = $user->role_id == 2
        ? 'Chào mừng Admin!'
        : 'Chào mừng bạn đến với BeeShop';

    return response()->json([
        'message' => $loginMessage,
        'user_name' => $user->username,
        'access_token' => $token,
        'role_id' => $user->role_id,
        'user_id' => $user->id,
    ], 200);
}


    // Gửi mã OTP để xác minh
    // public function sendOtp(Request $request)
    // {
    //     $validator = Validator::make($request->all(), [
    //         'email' => 'required|email|exists:users,email',
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json($validator->errors(), 400);
    //     }

    //     $lastSent = \DB::table('password_resets')->where('email', $request->email)->latest()->first();
    //     if ($lastSent && Carbon::parse($lastSent->created_at)->addMinutes(5)->isFuture()) {
    //         return response()->json(['message' => 'Vui lòng đợi ít nhất 5 phút trước khi yêu cầu lại mã OTP.'], 400);
    //     }

    //     $otp = random_int(100000, 999999); // Tạo mã OTP 6 chữ số
    //     $expiresAt = Carbon::now()->addMinutes(10); // Thời gian hết hạn (10 phút)

    //     \DB::table('password_resets')->updateOrInsert(
    //         ['email' => $request->email],
    //         [
    //             'token' => Hash::make($otp),
    //             'created_at' => now(),
    //             'expires_at' => $expiresAt,
    //         ]
    //     );

    //     Mail::to($request->email)->send(new ResetPasswordMail($otp));

    //     return response()->json(['message' => 'Mã xác minh đã được gửi đến email của bạn.']);
    // }

    // // Reset mật khẩu người dùng
    // public function resetPassword(Request $request)
    // {
    //     $validator = Validator::make($request->all(), [
    //         'email' => 'required|email|exists:users,email',
    //         'token' => 'required|string',
    //         'password' => 'required|string|min:6|confirmed',
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json($validator->errors(), 400);
    //     }

    //     $resetRecord = \DB::table('password_resets')
    //         ->where('email', $request->email)
    //         ->first();

    //     if (!$resetRecord || !Hash::check($request->token, $resetRecord->token)) {
    //         return response()->json(['message' => 'Mã xác minh không hợp lệ hoặc đã hết hạn.'], 400);
    //     }

    //     $user = User::where('email', $request->email)->first();
    //     if (!$user) {
    //         return response()->json(['message' => 'Không tìm thấy người dùng với email này.'], 404);
    //     }

    //     $user->password_hash = Hash::make($request->password);
    //     $user->save();

    //     \DB::table('password_resets')->where('email', $request->email)->delete();

    //     return response()->json(['message' => 'Mật khẩu đã được thay đổi thành công.']);
    // }

    // Gửi mã OTP để xác minh
    public function sendOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);
    
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
    
        // Debug: kiểm tra bản ghi đã tồn tại chưa
        $lastSent = \DB::table('password_resets')->where('email', $request->email)->latest()->first();
        \Log::info('Last Sent:', ['lastSent' => $lastSent]);
    
        if ($lastSent && Carbon::parse($lastSent->created_at)->addMinutes(5)->isFuture()) {
            return response()->json(['message' => 'Vui lòng đợi ít nhất 5 phút trước khi yêu cầu lại mã OTP.'], 400);
        }
    
        // Tạo mã OTP
        $otp = random_int(100000, 999999); // Tạo mã OTP 6 chữ số
        $expiresAt = Carbon::now()->addMinutes(10); // Thời gian hết hạn (10 phút)
    
        \Log::info('OTP and Expiry:', ['otp' => $otp, 'expiresAt' => $expiresAt]);
    
        \DB::table('password_resets')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => Hash::make($otp),
                'created_at' => now(),
                'expires_at' => $expiresAt,
            ]
        );
    
        Mail::to($request->email)->send(new ResetPasswordMail($otp));
    
        return response()->json(['message' => 'Mã xác minh đã được gửi đến email của bạn.']);
    }
// Xác minh mã OTP và tiến hành đổi mật khẩu
public function verifyOtp(Request $request)
{
    $validator = Validator::make($request->all(), [
        'email' => 'required|email|exists:users,email',
        'token' => 'required|string',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 400);
    }

    // Kiểm tra mã OTP trong bảng password_resets
    $resetRecord = \DB::table('password_resets')
        ->where('email', $request->email)
        ->first();

    if (!$resetRecord || !Hash::check($request->token, $resetRecord->token)) {
        return response()->json(['message' => 'Mã xác minh không hợp lệ hoặc đã hết hạn.'], 400);
    }

    // Kiểm tra xem mã OTP đã hết hạn chưa
    if (Carbon::now()->greaterThan($resetRecord->expires_at)) {
        return response()->json(['message' => 'Mã xác minh đã hết hạn.'], 400);
    }

    return response()->json(['message' => 'Mã OTP hợp lệ. Bạn có thể thay đổi mật khẩu.']);
}

// Thay đổi mật khẩu
public function resetPassword(Request $request)
{
    $validator = Validator::make($request->all(), [
        'email' => 'required|email|exists:users,email',
        'password_hash' => 'required|string|min:6|confirmed',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 400);
    }

    // Tìm người dùng qua email
    $user = User::where('email', $request->email)->first();
    if (!$user) {
        return response()->json(['message' => 'Không tìm thấy người dùng với email này.'], 404);
    }

    // Cập nhật mật khẩu mới
    $user->password_hash = Hash::make($request->password_hash);
    $user->save();

    // Xóa bản ghi OTP trong bảng password_resets
    \DB::table('password_resets')->where('email', $request->email)->delete();

    return response()->json(['message' => 'Mật khẩu đã được thay đổi thành công.']);
}







}
