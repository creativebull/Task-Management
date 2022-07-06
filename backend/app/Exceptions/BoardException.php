<?php

namespace App\Exceptions;

class BoardException extends CustomBaseException
{
    /**
     * @return self
     */
    public static function boardNotFound(): self
    {
        return new self('Board does not exist', ['board' => trans('board.board_does_not_exist')]);
    }

    /**
     * @return static
     */
    public static function boardSameName(): self
    {
        return new self('Board with that name already exists', ['board' => trans('board.already_exists')]);
    }
}
