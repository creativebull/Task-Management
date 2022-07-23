<?php

namespace App\Core\Services\BoardList;

use App\Core\Services\Workspace\WorkspacePermissionService;
use App\Exceptions\WorkspaceException;
use App\Models\Board;
use App\Models\BoardList;
use App\Models\Workspace;
use Throwable;

class BoardListUpdateService
{
    /**
     * @param Workspace $workspace
     * @param Board $board
     * @param BoardList $boardList
     * @param array $validatedData
     * @return $this
     * @throws WorkspaceException|Throwable
     */
    public function updateBoardList(Workspace $workspace, Board $board, BoardList $boardList, array $validatedData): self
    {
        // Make sure the user has access to this workspace
        if (!WorkspacePermissionService::userHasAccessToWorkspace(auth()->user(), $workspace)) {
            throw WorkspaceException::noAccessToWorkspace();
        }

        // Make sure the board belongs to the workspace
        if ($board->workspace_id !== $workspace->id) {
            throw WorkspaceException::noAccessToWorkspace();
        }

        // Update the board list
        $boardList->name = $validatedData['name'];
        $boardList->saveOrFail();

        return $this;
    }
}
