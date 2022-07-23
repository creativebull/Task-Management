<?php

namespace App\Core\Services\BoardList;

use App\Core\Services\Workspace\WorkspacePermissionService;
use App\Exceptions\WorkspaceException;
use App\Models\Board;
use App\Models\BoardList;
use App\Models\Workspace;
use Throwable;

class BoardListReorderService
{
    /**
     * @param Workspace $workspace
     * @param Board $board
     * @param BoardList $boardList
     * @param int $position
     * @return $this
     * @throws WorkspaceException
     * @throws Throwable
     */
    public function reorderBoardList(Workspace $workspace, Board $board, BoardList $boardList, int $position): self
    {
        // Make sure the user has access to this workspace
        if (!WorkspacePermissionService::userHasAccessToWorkspace(auth()->user(), $workspace)) {
            throw WorkspaceException::noAccessToWorkspace();
        }

        // Make sure the board belongs to the workspace
        if ($board->workspace_id !== $workspace->id) {
            throw WorkspaceException::noAccessToWorkspace();
        }

        // TODO - Implement reorderBoardList() method.

        return $this;
    }
}
