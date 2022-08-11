<?php

namespace App\Core\Services\Board;

use App\Core\Services\Auth\AuthHelper;
use App\Exceptions\BoardException;
use App\Exceptions\WorkspaceException;
use App\Models\Board;
use App\Models\Workspace;

class BoardDeleteService
{
    /**
     * @param Board $board
     * @param Workspace $workspace
     * @return void
     * @throws BoardException
     * @throws WorkspaceException
     */
    public function deleteBoard(Board $board, Workspace $workspace): void
    {
        if ($workspace->user->id !== AuthHelper::getLoggedInUser()->id) {
            throw WorkspaceException::workspaceNotFound();
        }

        if ($board->user->id !== AuthHelper::getLoggedInUser()->id) {
            throw BoardException::boardNotFound();
        }

        // Delete all lists for this board
        foreach ($board->boardLists() as $boardList) {
            // Delete all tasks for this board list
            foreach ($boardList->boardTasks() as $boardTask) {
                $boardTask->delete();
            }
            $boardList->delete();
        }

        $board->delete();
    }
}
