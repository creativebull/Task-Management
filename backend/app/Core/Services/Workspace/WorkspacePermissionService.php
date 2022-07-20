<?php

namespace App\Core\Services\Workspace;

use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceMembers;

class WorkspacePermissionService
{
    public static function userHasAccessToWorkspace(User $user, Workspace $workspace): bool
    {
        if ($workspace->user_id === $user->id) {
            return true;
        }

        // If the user is a member of the workspace they have access
        $workspaceMember = WorkspaceMembers::query()->where('workspace_id', '=', $workspace->id)->where('user_id', '=', $user->id)->first();

        if (!$workspaceMember) {
            return false;
        }

        return true;
    }
}
