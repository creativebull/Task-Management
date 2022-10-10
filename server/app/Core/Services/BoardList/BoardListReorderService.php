<?php

namespace App\Core\Services\BoardList;

use App\Core\Services\Auth\AuthHelper;
use App\Core\Services\Workspace\WorkspacePermissionService;
use App\Exceptions\WorkspaceException;
use App\Models\Board;
use App\Models\BoardList;
use App\Models\Workspace;
use Illuminate\Http\Request;
use Throwable;

class BoardListReorderService
{
    /**
     * @param Workspace $workspace
     * @param Board $board
     * @param Request $request
     * @return $this
     * @throws Throwable
     * @throws WorkspaceException
     */
    public function reorderBoardList(Workspace $workspace, Board $board, Request $request): self
    {
        // Ensure the user has access to this workspace
        if (!WorkspacePermissionService::userHasAccessToWorkspace(AuthHelper::getLoggedInUser(), $workspace)) {
            throw WorkspaceException::noAccessToWorkspace();
        }

        // Ensure the board belongs to the workspace
        if ($board->workspace_id !== $workspace->id) {
            throw WorkspaceException::noAccessToWorkspace();
        }

        $boardLists = $request->get('boardLists');
        $position = 1;
        foreach ($boardLists as $boardList) {
            $boardListModel = BoardList::query()->where('uuid', '=', $boardList)->first();
            if (!$boardListModel) {
                continue;
            }
            $boardListModel->position = $position;
            $boardListModel->saveOrFail();
            $position++;
        }

        return $this;
    }
}
