<?php

use App\Http\Controllers\API\CartController;
use App\Http\Controllers\API\CartDetailController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ProductVariantController;


Route::middleware('auth:api')->group(function () {
Route::delete('/cart-detail/{id}', [CartController::class,'deleteCart']);
Route::delete('/carts-detail', [CartController::class,'deleteCarts']);
Route::post('/carts-detail-order', [CartDetailController::class,'cartDetailOrder']);

    Route::post('/cart/add', [CartController::class, 'addToCart']);
    Route::get('/cart', [CartController::class, 'viewCart']);
    
    Route::delete('/cart/remove/{id}', [CartController::class, 'removeFromCart']);
    Route::put('/cart-detail/{id}', [CartController::class, 'updateQuantity']);
});




