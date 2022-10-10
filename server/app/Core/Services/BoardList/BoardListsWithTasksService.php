<?php

namespace App\Core\Services\BoardList;

use App\Core\Services\Auth\AuthHelper;
use App\Core\Services\Workspace\WorkspacePermissionService;
use App\Exceptions\WorkspaceException;
use App\Models\Board;
use App\Models\BoardList;
use App\Models\Workspace;
use Illuminate\Database\Eloquent\Collection;

class BoardListsWithTasksService
{
    /**
     * @param Workspace $workspace
     * @param Board $board
     * @return Collection
     * @throws WorkspaceException
     */
    public function boardListsWithTasks(Workspace $workspace, Board $board): Collection
    {
        // Ensure the user has access to this workspace
        if (!WorkspacePermissionService::userHasAccessToWorkspace(AuthHelper::getLoggedInUser(), $workspace)) {
            throw WorkspaceException::noAccessToWorkspace();
        }

        // Get the board lists with tasks
        return BoardList::query()
            ->with(['tasks' => function ($query) {
                $query->orderBy('position', 'asc');
            }])
            ->where('board_id', '=', $board->id)
            ->orderBy('position')
            ->get();
    }
}
