<?php

namespace App\Core\Services\WorkspaceInvite;

use App\Exceptions\WorkspaceException;
use App\Http\Resources\WorkspaceInvite\WorkspaceInviteResource;
use App\Models\WorkspaceInvite;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class WorkspaceInviteDetailsService
{
    /**
     * @param WorkspaceInvite $workspaceInvite
     * @return JsonResponse
     * @throws WorkspaceException
     */
    public static function workspaceInviteDetails(WorkspaceInvite $workspaceInvite): JsonResponse
    {
        if ($workspaceInvite->created_at === null) {
            throw WorkspaceException::inviteExpired();
        }

        $expires = Carbon::parse($workspaceInvite->expires_at);

        // Check if the invite is still valid
        if ($expires->isPast()) {
            throw WorkspaceException::inviteExpired();
        }

        return response()->json([
            'success' => true,
            'data' => new WorkspaceInviteResource($workspaceInvite),
        ]);
    }
}
