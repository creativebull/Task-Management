<?php

namespace App\Core\Services\Board;

use App\Core\Services\Auth\AuthHelper;
use App\Exceptions\BoardException;
use App\Models\Board;
use App\Models\Workspace;
use Illuminate\Http\UploadedFile;
use Throwable;

class BoardCreateService extends BoardService
{
    /**
     * @param array $requestData
     * @param Workspace $workspace
     * @param UploadedFile|null $image
     * @return Board
     * @throws BoardException
     * @throws Throwable
     */
    public function createBoard(array $requestData, Workspace $workspace, UploadedFile $image = null): Board
    {
        $requestData['workspace_id'] = $workspace->id;
        $requestData['user_id'] = AuthHelper::getLoggedInUser()->id;

        $board = new Board($requestData);

        // Check if there is already a board with the same name
        $existingBoard = Board::query()->where('workspace_id', '=', $workspace->id)->where('name', '=', $board->name)->first();

        if ($existingBoard) {
            throw BoardException::boardSameName();
        }

        $this->addImageToBoardIfExists($board, $image);

        $board->saveOrFail();

        return $board;
    }
}
