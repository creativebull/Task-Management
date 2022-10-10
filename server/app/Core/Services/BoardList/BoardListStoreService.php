<?php

namespace App\Core\Services\BoardList;

use App\Core\Services\Auth\AuthHelper;
use App\Core\Services\Workspace\WorkspacePermissionService;
use App\Exceptions\WorkspaceException;
use App\Models\Board;
use App\Models\BoardList;
use App\Models\Workspace;
use Illuminate\Http\Request;

class BoardListStoreService
{
    public function storeBoardList(Workspace $workspace, Board $board, Request $request)
    {
        // Ensure the user has access to this workspace
        if (!WorkspacePermissionService::userHasAccessToWorkspace(AuthHelper::getLoggedInUser(), $workspace)) {
            throw WorkspaceException::noAccessToWorkspace();
        }

        // Find the next position for the board list
        $nextPosition = BoardList::query()->where('board_id', '=', $board->id)->max('position') + 1;

        $validatedData = $request->validated();
        $validatedData['board_id'] = $board->id;
        $validatedData['position'] = $nextPosition;

        // Create the board list
        $boardList = new BoardList($validatedData);

        $boardList->saveOrFail();

        return $boardList;
    }
}
