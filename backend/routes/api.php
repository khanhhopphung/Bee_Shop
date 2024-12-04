<?php

use App\Http\Controllers\API\BlogController;
use App\Http\Controllers\API\PromotionController;
use App\Http\Controllers\API\ShippingAddressController;
use App\Http\Controllers\Api\StatisticsController;
use App\Http\Controllers\API\TierController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\RoleController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\API\ColorController;
use App\Http\Controllers\API\SizeController;
use App\Http\Controllers\API\ImageController;
use App\Http\Controllers\API\ReviewController;
use App\Http\Controllers\API\OrderController;
use App\Http\Controllers\API\PaymentController;
use App\Models\Tier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/verify-email', [AuthController::class, 'verifyEmail']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class,'logout'])->middleware('auth:sanctum');


Route::apiResource('blogs', controller: BlogController::class);
Route::post('/blogs/{blog}/update', [BlogController::class, 'update']);


Route::apiResource('tiers', TierController::class);
Route::apiResource('promotions', PromotionController::class);
Route::apiResource('addresses', ShippingAddressController::class);
Route::prefix('statistics')->group(function () {
    Route::get('dashboard', [StatisticsController::class, 'dashboard']); 
});
Route::apiResource( 'users', UserController::class);

Route::apiResource('addresses', ShippingAddressController::class);



Route::apiResource('roles', RoleController::class);
Route::apiResource('colors', ColorController::class);
Route::apiResource('sizes', SizeController::class);
Route::apiResource('images', ImageController::class);
Route::apiResource('reviews', ReviewController::class);
Route::get('get-reviews-by-product/{productId}', [ReviewController::class,'getAllReviewByProduct']);

Route::middleware('auth:api')->group(function () {
    Route::get('/get-adrress-user', [UserController::class,'allAddressesUser']);
    Route::put('/update-default-address-user', [UserController::class,'updateDefaultAddressesUser']);
    Route::put('/update-address/{id}', [UserController::class, 'updateAddress']);
    Route::delete('/delete-address-user/{id}', [UserController::class,'deleteAddress']);
    Route::post('/post-address-user', [UserController::class,'addAddress']);
    Route::get('/show-user', [UserController::class,'showUser']);
    Route::post('/check', [PromotionController::class,'check']);

});

Route::middleware('auth:api')->group(function () {
    Route::put('/update-phone/{id}', [UserController::class, 'updatePhone']);
});

// Route::post('/send-otp', [AuthController::class, 'sendOtp'])->name('auth.sendOtp');
// Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('auth.resetPassword');
// Gửi mã OTP để thay đổi mật khẩu
Route::post('/send-otp', [AuthController::class, 'sendOtp'])->name('auth.sendOtp');

// Xác minh mã OTP và thay đổi mật khẩu
Route::post('/verify-otp', [AuthController::class, 'verifyOtp'])->name('auth.verifyOtp');

// Thay đổi mật khẩu sau khi xác minh mã OTP
Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('auth.resetPassword');

//Thanh toán vn pay
Route::post('/payment-vnpay', [PaymentController::class, 'vnPay']);
Route::post('/vnpay-return', [PaymentController::class, 'paymentReturn']);
// Route::post('/payment-vnpay-callback', [PaymentController::class, 'paymentVnpayCallback']);
// Route::post('/payment-vnpay-cancel', [PaymentController::class, 'paymentVnpayCancel']);
// Route::post('/payment-vnpay-return', [PaymentController::class, 'paymentVnpayReturn']);
// Route::post('/payment-vnpay-success', [PaymentController::class, 'paymentVnpaySuccess']);

