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

    /**
     * @return WorkspaceException
     */
    public static function cannotInviteOwner(): WorkspaceException
    {
        return new self('Cannot Invite Owner', ['workspace' => trans('workspace.cannot_invite_owner')]);
    }

    /**
     * @return WorkspaceException
     */
    public static function inviteDoesNotMatch(): WorkspaceException
    {
        return new self('Invalid user for invite', ['workspace' => trans('workspace.invalid_user')]);
    }

    public static function workspaceSameName(): WorkspaceException
    {
        return new self('There is already a workspace with this name', ['workspace' => trans('workspace.duplicate_workspace')]);
    }

}
