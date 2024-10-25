<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;


class AuthController extends Controller
{
    
    // Đăng ký
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|unique:users',
            'email' => 'required|string|email|unique:users',
            'password_hash' => 'required|string|min:6',
            'phone' => 'required|string|min:10',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password_hash' => Hash::make($request->password_hash) ,
            'phone' => $request->phone,
            'role_id' => 1, 
            'tier_id' => 1, 
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }
    

    // Đăng nhập
    public function login(Request $request)
{
    $credentials = $request->only('username', 'password');

    

// Lấy người dùng
    $user = User::where('username', $credentials['username'])->first();

    if ($user && Hash::check($credentials['password'], $user->password_hash)) {
        
   
// Đăng nhập thành công
        
       
Auth::login($user);
        
       
return response()->json(['message' => 'Login successful']);
    }

    
    
// Đăng nhập thất bại
    return response()->json(['message' => 'Invalid credentials'], 401);
}


    

    // Lấy thông tin người dùng đã đăng nhập
    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    
    // Đăng xuất
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
}
