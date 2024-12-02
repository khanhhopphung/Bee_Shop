<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ProductController;

Route::get('products-related/{id}', [ProductController::class, 'getRelatedProducts'])
    ->where('product', '[0-9]+'); // Chỉ chấp nhận số
Route::group(["prefix"=> "products"], function () {
    Route::get("search", [ProductController::class,'search']);
});
Route::get('products-search', [ProductController::class, 'search'])->name('products.search');
Route::get('best-products',[ProductController::class, 'bestProduct']);
Route::get('bad-products',[ProductController::class, 'badProduct']);
Route::get('all-products',[ProductController::class, 'indexClient']);
Route::get('products/category/{category?}', [ProductController::class, 'filter'])->name('products.category');

Route::get('products/{id}/variants', [ProductController::class, 'getVariants']);


Route::apiResource('products', ProductController::class);
Route::post('/products/{product}', [ProductController::class, 'update']);


Route::post('/products/{product}/update', [ProductController::class, 'update']);

