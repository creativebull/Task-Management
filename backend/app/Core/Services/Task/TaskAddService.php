<?php

namespace App\Core\Services\Task;

use App\Core\Services\Auth\AuthHelper;
use App\Core\Services\Workspace\WorkspacePermissionService;
use App\Exceptions\UserException;
use App\Exceptions\WorkspaceException;
use App\Http\Requests\Tasks\StoreTaskRequest;
use App\Models\Board;
use App\Models\BoardList;
use App\Models\Task;
use App\Models\User;
use App\Models\Workspace;
use Throwable;

class TaskAddService
{
    /**
     * @param StoreTaskRequest $request
     * @param Workspace $workspace
     * @param Board $board
     * @param BoardList $boardList
     * @return Task
     * @throws UserException
     * @throws WorkspaceException
     * @throws Throwable
     */
    public function addNewTask(StoreTaskRequest $request, Workspace $workspace, Board $board, BoardList $boardList): Task
    {
        $validated = $request->validated();

        if (strtolower($validated['assigned_to']) === 'current user') {
            $validated['assigned_to'] = auth()->user()->id;
        } elseif (strtolower($validated['assigned_to']) === '') {
            $validated['assigned_to'] = null;
        } else {
            // Make sure the user passed exists
            /** @var User $user */
            $user = User::query()->where('uuid', '=', $validated['assigned_to'])->firstOrFail();

            // Make sure the user has access to the workspace
            if (!WorkspacePermissionService::userHasAccessToWorkspace($user, $workspace)) {
                throw WorkspaceException::noAccessToWorkspace();
            }

            $validated['assigned_to'] = $user->id;
        }

        $validated['board_list_id'] = $boardList->id;
        $validated['user_id'] = auth()->user()->id;

        // Find the next position for the task
        $nextPosition = Task::query()->where('board_list_id', '=', $boardList->id)->max('position') + 1;

        $validated['position'] = $nextPosition;

        $task = new Task($validated);
        $task->saveOrFail();

        return $task;
    }
}
