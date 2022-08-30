<?php

namespace App\Core\Services\Task;

use App\Core\Services\Auth\AuthHelper;
use App\Core\Services\Workspace\WorkspacePermissionService;
use App\Exceptions\BoardException;
use App\Exceptions\WorkspaceException;
use App\Models\Board;
use App\Models\BoardList;
use App\Models\Task;
use App\Models\Workspace;
use Throwable;

class TaskDeleteService
{
    /**
     * @param Task $task
     * @return bool
     * @throws BoardException
     * @throws WorkspaceException
     * @throws Throwable
     */
    public function deleteTask(Task $task): bool
    {
        /** @var BoardList $boardList */
        $boardList = $task->boardList()->firstOrFail();
        /** @var Board $board */
        $board = $boardList->board()->firstOrFail();
        /** @var Workspace $workspace */
        $workspace = $board->workspace()->firstOrFail();

        // Check if the user has access to this workspace
        if (!WorkspacePermissionService::userHasAccessToWorkspace(AuthHelper::getLoggedInUser(), $workspace)) {
            throw WorkspaceException::noAccessToWorkspace();
        }

        // Make sure the board belongs to the workspace
        if ($board->workspace_id !== $workspace->id) {
            throw BoardException::noAccessToBoard();
        }

        $task->deleteOrFail();

        return true;
    }
}
