<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\WorkspaceController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('login', [AuthController::class, 'login'])->name('login');
Route::post('register', [AuthController::class, 'register'])->name('register');

Route::middleware(['auth:api'])->group(function () {

    Route::prefix('user')->group(function () {
        Route::get('details', [AuthController::class, 'userDetails']);
        Route::post('update', [AuthController::class, 'update']);
        Route::post('change-password', [AuthController::class, 'changePassword']);
        Route::get('logout', [AuthController::class, 'logout']);
    });

    Route::apiResource('tasks', TaskController::class);

    Route::prefix('workspaces')->group(function () {
        Route::get('', [WorkspaceController::class, 'index'])->name('workspaces.index');
        Route::post('', [WorkspaceController::class, 'store'])->name('workspaces.store');
        Route::get('{workspace:uuid}', [WorkspaceController::class, 'show'])->name('workspaces.show');
        Route::put('{workspace}', [WorkspaceController::class, 'update'])->name('workspaces.update');
        Route::delete('{workspace}', [WorkspaceController::class, 'destroy'])->name('workspaces.destroy');
    });
});
