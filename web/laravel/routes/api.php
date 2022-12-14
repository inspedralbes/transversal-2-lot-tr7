<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GameController;
use App\Http\Controllers\Api\ScoreController;
use App\Http\Controllers\Api\ChallengeController;
use Illuminate\Support\Facades\Route;

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::get('ranking', [AuthController::class, 'ranking']);
Route::post('user-profile', [AuthController::class, 'userProfile']);
// Route::get('create-daily-game', [GameController::class, 'createDailyGame']);

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('my-profile', [AuthController::class, 'myProfile']);
    Route::get('users-list', [AuthController::class, 'usersList']);
    Route::post('update-profile', [AuthController::class, 'updateProfile']);
    Route::post('create-game', [GameController::class, 'createGame']);
    Route::post('get-game', [GameController::class, 'getGame']);
    Route::get('get-daily-game', [GameController::class, 'getDailyGame']);
    Route::post('create-score', [ScoreController::class, 'createScore']);
    Route::post('update-score', [ScoreController::class, 'updateScore']);
    Route::post('create-challenge', [ChallengeController::class, 'createChallenge']);
    Route::get('challenges-list', [ChallengeController::class, 'challengesList']);
    Route::post('challenge-winner', [ChallengeController::class, 'challengeWinner']);
});
