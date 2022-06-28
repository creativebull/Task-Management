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

    /**
     * @return WorkspaceException
     */
    public static function inviteLimitExceeded(): WorkspaceException
    {
        return new self('Workspace invite limit reached', ['workspace' => trans('workspace.workspace_invite_limit_reached')]);
    }

    /**
     * @return WorkspaceException
     */
    public static function inviteExpired(): WorkspaceException
    {
        return new self('Workspace Invite expired', ['workspace' => trans('workspace.workspace_invite_expired')]);
    }

}
