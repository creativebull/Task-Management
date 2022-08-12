<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BoardController;
use App\Http\Controllers\BoardListController;
use App\Http\Controllers\TaskController;
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

                Route::get('boardLists', [BoardListController::class, 'listsForBoard'])->name('boards.lists');
                Route::post('boardLists', [BoardListController::class, 'store'])->name('boards.lists');
                Route::post('boardLists/reorder', [BoardListController::class, 'reorderLists'])->name('boards.lists');
                Route::post('boardLists/move-task', [BoardListController::class, 'moveTask'])->name('boards.lists.move');
                Route::post('boardLists/{boardList:uuid}/reorder-tasks', [BoardListController::class, 'reorderTasks'])->name('boards.lists.reorder-tasks');
                Route::delete('boardLists/{boardList:uuid}', [BoardListController::class, 'destroy'])->name('boards.lists.destroy');
                Route::put('boardLists/{boardList:uuid}', [BoardListController::class, 'update'])->name('boards.lists.update');

                Route::post('{boardList:uuid}/tasks', [TaskController::class, 'store'])->name('boards.lists.tasks.store');
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
