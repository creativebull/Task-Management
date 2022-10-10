<?php

namespace App\Core\Services\Task;

use App\Core\Services\Auth\AuthHelper;
use App\Core\Services\Workspace\WorkspacePermissionService;
use App\Exceptions\WorkspaceException;
use App\Http\Requests\Tasks\UpdateTaskRequest;
use App\Models\Task;
use App\Models\User;
use App\Models\Workspace;

class TaskUpdateService
{
    /**
     * @param UpdateTaskRequest $request
     * @param Workspace $workspace
     * @param Task $task
     * @return Task
     * @throws WorkspaceException
     */
    public function updateTask(UpdateTaskRequest $request, Workspace $workspace, Task $task): Task
    {
        $validated = $request->validated();

        if (strtolower($validated['assigned_to']) === 'current user') {
            $validated['assigned_to'] = AuthHelper::getLoggedInUser()->id;
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

        $task->update($validated);
        return $task;
    }
}
