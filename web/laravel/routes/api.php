<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GameController;
use App\Http\Controllers\Api\ScoreController;
use Illuminate\Support\Facades\Route;

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::get('create-daily-game', [GameController::class, 'createDailyGame']);

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('user-profile', [AuthController::class, 'userProfile']);
    Route::get('users-list', [AuthController::class, 'usersList']);
    Route::post('create-game', [GameController::class, 'createGame']);
    Route::get('get-game', [GameController::class, 'getGame']);
    Route::get('get-daily-game', [GameController::class, 'getDailyGame']);
    Route::post('create-score', [ScoreController::class, 'createScore']);
    Route::post('update-score', [ScoreController::class, 'updateScore']);
});
