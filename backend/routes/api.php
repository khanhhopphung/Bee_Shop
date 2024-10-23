<?php

use App\Http\Controllers\API\BlogController;
use App\Http\Controllers\API\PromotionController;
use App\Http\Controllers\API\TierController;
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

Route::apiResource('blogs', BlogController::class);

Route::apiResource('tiers', TierController::class);

Route::apiResource('promotions', PromotionController::class);

