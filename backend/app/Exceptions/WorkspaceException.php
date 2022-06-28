<?php

namespace App\Exceptions;

class WorkspaceException extends CustomBaseException
{
    /**
     * @return WorkspaceException
     */
    public static function workspaceNotFound(): WorkspaceException
    {
        return new self('Workspace does not exist', ['workspace' => trans('workspace.workspace_does_not_exist')]);
    }

}
