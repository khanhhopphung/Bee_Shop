<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ProductController;
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

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::group(["prefix"=> "products"], function () {
    Route::get("search", [ProductController::class,'search']);
});
Route::get('products-search', [ProductController::class, 'search'])->name('products.search');
Route::get('best-products',[ProductController::class, 'bestProduct']);
Route::get('bad-products',[ProductController::class, 'badProduct']);
Route::get('products/category/{category?}', [ProductController::class, 'filter'])->name('products.category');

Route::apiResource('products', ProductController::class);
Route::post('/products/{product}', [ProductController::class, 'update']);


Route::post('/products/{product}/update', [ProductController::class, 'update']);

