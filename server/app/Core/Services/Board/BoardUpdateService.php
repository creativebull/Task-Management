<?php

namespace App\Core\Services\Board;

use App\Core\Services\Auth\AuthHelper;
use App\Exceptions\WorkspaceException;
use App\Models\Board;
use App\Models\Workspace;
use Illuminate\Http\UploadedFile;

class BoardUpdateService extends BoardService
{
    /**
     * @param Board $board
     * @param array $requestData
     * @param Workspace $workspace
     * @param UploadedFile|null $image
     * @return Board
     * @throws WorkspaceException
     */
    public function updateBoard(Board $board, array $requestData, Workspace $workspace, UploadedFile $image = null): Board
    {
        if ($workspace->user->id !== AuthHelper::getLoggedInUser()->id) {
            throw WorkspaceException::workspaceNotFound();
        }

        $board = $this->addImageToBoardIfExists($board, $image);

        $board->update($requestData);

        return $board;
    }
}
