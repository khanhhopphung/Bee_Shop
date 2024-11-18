<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\OrderController;


Route::middleware('auth:api')->group(function () {

Route::resource('orders', OrderController::class);
Route::get('/orders', [OrderController::class, 'index'])->middleware('auth:api');
});