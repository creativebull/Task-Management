<?php

namespace App\Core\Services\WorkspaceInvite;

use App\Exceptions\UserException;
use App\Exceptions\WorkspaceException;
use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceInvite;
use App\Models\WorkspaceMembers;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Throwable;

class WorkspaceInviteAcceptService
{
    /**
     * @param WorkspaceInvite $workspaceInvite
     * @return JsonResponse
     * @throws UserException
     * @throws WorkspaceException
     * @throws Throwable
     */
    public static function acceptInvite(WorkspaceInvite $workspaceInvite): JsonResponse
    {
        $expires = Carbon::parse($workspaceInvite->expires_at);

        // Check if the invite is still valid
        if ($expires->isPast()) {
            throw WorkspaceException::inviteExpired();
        }

        $workspace = Workspace::query()->findOrFail($workspaceInvite->workspace_id);

        $user = User::query()->where('email', '=', $workspaceInvite->email)->first();

        if ($user === null) {
            throw UserException::userNotFound();
        }

        if ((int)$user->id === (int)$workspace->user_id) {
            throw WorkspaceException::cannotInviteOwner();
        }

        // Does the invite match the logged-in user
        if ($user->id !== auth()->user()->id) {
            throw WorkspaceException::inviteDoesNotMatch();
        }

        $workspaceMember = new WorkspaceMembers([
            'user_id' => $user->id,
            'workspace_id' => $workspace->id,
        ]);

        $workspaceMember->saveOrFail();

        $workspaceInvite->delete();

        return response()->json([
            'success' => true,
        ]);
    }
}
