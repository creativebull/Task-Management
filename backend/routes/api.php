<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BoardController;
use App\Http\Controllers\BoardListController;
use App\Http\Controllers\WorkspaceController;
use App\Http\Controllers\WorkspaceMembersController;
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

// Details for workspace invite, Needs to be public
Route::get('details/{workspaceInvite:token}', [WorkspaceMembersController::class, 'details'])->name('workspace-members.details');

Route::middleware(['auth:api'])->group(function () {

    Route::prefix('user')->group(function () {
        Route::get('details', [AuthController::class, 'userDetails']);
        Route::post('update', [AuthController::class, 'update']);
        Route::post('change-password', [AuthController::class, 'changePassword']);
        Route::get('logout', [AuthController::class, 'logout']);
    });

    Route::prefix('boards')->group(function () {
        Route::prefix('{workspace:uuid}')->group(function () {
            Route::get('', [BoardController::class, 'index'])->name('boards.index');
            Route::post('', [BoardController::class, 'store'])->name('boards.store');

            Route::prefix('{board:uuid}')->group(function () {
                Route::get('', [BoardController::class, 'show'])->name('boards.show');
                Route::put('', [BoardController::class, 'update'])->name('boards.update');
                Route::delete('', [BoardController::class, 'destroy'])->name('boards.destroy');

                Route::get('lists', [BoardListController::class, 'listsForBoard'])->name('boards.lists');
                Route::post('lists', [BoardListController::class, 'store'])->name('boards.lists');
            });
        });
    });

    Route::prefix('workspaces')->group(function () {
        Route::get('', [WorkspaceController::class, 'index'])->name('workspaces.index');
        Route::post('', [WorkspaceController::class, 'store'])->name('workspaces.store');
        Route::get('{workspace:uuid}', [WorkspaceController::class, 'show'])->name('workspaces.show');
        Route::put('{workspace:uuid}', [WorkspaceController::class, 'update'])->name('workspaces.update');
        Route::delete('{workspace:uuid}', [WorkspaceController::class, 'destroy'])->name('workspaces.destroy');

        Route::get('{workspace:uuid}/members', [WorkspaceMembersController::class, 'index'])->name('workspace-members.index');
    });

    Route::prefix('workspace-members')->group(function () {
        Route::post('invite', [WorkspaceMembersController::class, 'invite'])->name('workspace-members.invite');
        Route::get('accept/{workspaceInvite:token}', [WorkspaceMembersController::class, 'accept'])->name('workspace-members.accept');
    });
});
