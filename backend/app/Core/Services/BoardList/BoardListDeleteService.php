<?php

namespace App\Core\Services\BoardList;

use App\Core\Services\Workspace\WorkspacePermissionService;
use App\Exceptions\WorkspaceException;
use App\Models\Board;
use App\Models\BoardList;
use App\Models\Workspace;

class BoardListDeleteService
{
    public function deleteBoardList(Workspace $workspace, Board $board, BoardList $boardList)
    {
        // Make sure the user has access to this workspace
        if (!WorkspacePermissionService::userHasAccessToWorkspace(auth()->user(), $workspace)) {
            throw WorkspaceException::noAccessToWorkspace();
        }

        // Make sure the board belongs to the workspace
        if ($board->workspace_id !== $workspace->id) {
            throw WorkspaceException::noAccessToWorkspace();
        }

        // Delete all the tasks in the board list
        $tasks = $boardList->tasks()->get();
        foreach ($tasks as $task) {
            $task->delete();
        }

        // Delete the board list
        $boardList->delete();

        // Reset the positions of the remaining board lists
        $remainingBoardLists = BoardList::query()
            ->where('board_id', '=', $board->id)
            ->orderBy('position')->get();
        $position = 1;
        foreach ($remainingBoardLists as $remainingBoardList) {
            $remainingBoardList->position = $position;
            $remainingBoardList->save();
            $position++;
        }

        return $this;
    }
}
