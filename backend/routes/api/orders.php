<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\OrderController;


Route::middleware('auth:api')->group(function () {
Route::get('/get-all-order-by-user', [OrderController::class, 'getAllOrderByUser']);
Route::get('/cancel-order/{order}', [OrderController::class, 'cancel']);
Route::get('/get-one-order/{id}', [OrderController::class, 'getOneOrderByUser']);

Route::resource('orders', OrderController::class);
Route::get('/orders', [OrderController::class, 'index'])->middleware('auth:api');
});