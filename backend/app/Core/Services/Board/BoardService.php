<?php

namespace App\Core\Services\Board;

use App\Models\Board;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

abstract class BoardService
{
    /**
     * @param Board $board
     * @param UploadedFile|null $image
     * @return Board
     */
    protected function addImageToBoardIfExists(Board $board, UploadedFile $image = null): Board
    {
        // Check if there was a file, If so save it
        if ($image !== null) {
            $filename = time() . '_' . $image->getClientOriginalName();

            $fullFilePath = Storage::disk('public')->path('board-images/' . $filename);
            $databasePath = 'storage/board-images/' . $filename;

            // Ensure the directory exists
            if (!Storage::disk('public')->exists('board-images')) {
                Storage::disk('public')->makeDirectory('board-images');
            }

            $interventionImage = Image::make($image);
            $interventionImage->resize(200, 200, function ($constraint) {
                $constraint->aspectRatio();
            })->save($fullFilePath);

            $board->image = $databasePath;
        } else {
            $board->image = 'img/default-board-image.png';
        }

        return $board;
    }
}
