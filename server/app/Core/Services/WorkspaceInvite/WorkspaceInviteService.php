<?php

namespace App\Core\Services\WorkspaceInvite;

use App\Exceptions\WorkspaceException;
use App\Http\Requests\WorkspaceMembers\WorkspaceMemberInviteRequest;
use App\Mail\UserSignupWorkspaceInvite;
use App\Mail\UserWorkspaceInvite;
use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceInvite;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use Throwable;

class WorkspaceInviteService
{
    /**
     * @param WorkspaceMemberInviteRequest $request
     * @return JsonResponse
     * @throws WorkspaceException
     * @throws Throwable
     */
    public static function inviteEmail(WorkspaceMemberInviteRequest $request): JsonResponse
    {
        $email = $request->get('email');

        $user = User::query()->where('email', '=', $email)->first();

        /** @var Workspace $workspace */
        $workspace = Workspace::fromUuId($request->get('workspace_uuid'));

        if ($workspace === null) {
            throw WorkspaceException::workspaceNotFound();
        }

        // Check if the email address has had an invite sent to it.
        $invite = WorkspaceInvite::query()
            ->where('email', '=', $email)
            ->where('workspace_id', '=', $workspace->id)
            ->get();

        if (count($invite) > 5) {
            throw WorkspaceException::inviteLimitExceeded();
        }

        // Generate a random token for the invite
        $token = self::generateToken();

        // Date 4 weeks from now
        $expiresAt = now()->addWeeks(4);

        // Create a row in the workspace_invites table for this user.
        $workspaceInvite = (new WorkspaceInvite([
            'email' => $email,
            'workspace_id' => $workspace->id,
            'token' => $token,
            'expires_at' => $expiresAt,
        ]));

        // Add the user if one was found
        if ($user !== null) {
            $workspaceInvite->user_id = $user->id;
        }

        $workspaceInvite->saveOrFail();

        if ($user === null) {
            // The person with this email address does not currently exist in the system.
            $userSignupInvite = new UserSignupWorkspaceInvite();
            $userSignupInvite->workspaceInvite = $workspaceInvite;
            $userSignupInvite->workspace = $workspace;

            Mail::to($email)->send($userSignupInvite);

            return response()->json([
                'success' => true,
                'token' => $token, // TODO remove
            ]);
        }

        $userWorkspaceInvite = new UserWorkspaceInvite();
        $userWorkspaceInvite->workspaceInvite = $workspaceInvite;
        $userWorkspaceInvite->workspace = $workspace;

        Mail::to($email)->send($userWorkspaceInvite);

        return response()->json([
            'success' => 'true',
            'token' => $token, // TODO remove
        ]);
    }

    /**
     * @return string
     * @throws Exception
     */
    public static function generateToken(): string
    {
        $token = bin2hex(random_bytes(32));

        // Make sure the database doesnt already have this token
        $invite = WorkspaceInvite::query()->where('token', '=', $token)->first();

        if ($invite === null) {
            return $token;
        }

        return self::generateToken();
    }
}
