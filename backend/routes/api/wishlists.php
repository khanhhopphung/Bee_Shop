<?php

use App\Http\Controllers\WishlistController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::middleware('auth:api')->group(function () {
    Route::get('/wishlist', [WishlistController::class, 'index']); // Lấy danh sách yêu thích
    Route::post('/wishlist', [WishlistController::class, 'store']); // Thêm vào danh sách yêu thích
    Route::delete('/wishlist/{id}', [WishlistController::class, 'destroy']); // Xóa khỏi danh sách yêu thích
});