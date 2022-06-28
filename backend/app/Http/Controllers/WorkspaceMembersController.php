<?php

namespace App\Http\Controllers;

use App\Exceptions\WorkspaceException;
use App\Http\Requests\StoreWorkspaceMembersRequest;
use App\Http\Requests\UpdateWorkspaceMembersRequest;
use App\Http\Requests\WorkspaceMembers\WorkspaceMemberInviteRequest;
use App\Http\Resources\Workspace\WorkspaceCollection;
use App\Http\Resources\WorkspaceInvite\WorkspaceInviteResource;
use App\Mail\UserSignupWorkspaceInvite;
use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceInvite;
use App\Models\WorkspaceMembers;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Mail;
use Throwable;

class WorkspaceMembersController extends Controller
{
    /**
     * @throws WorkspaceException
     * @throws Exception
     * @throws Throwable
     */
    public function invite(WorkspaceMemberInviteRequest $request): JsonResponse
    {
        $email = $request->get('email');

        $user = User::query()->where('email', '=', $email)->first();

        /** @var Workspace $workspace */
        $workspace = Workspace::fromUuId($request->get('workspace_uuid'));

        if ($workspace === null) {
            throw WorkspaceException::workspaceNotFound();
        }

        if ($user === null) {
            // The person with this email address does not currently exist in the system.

            // Check if the email address has had an invite sent to it.
            $invite = WorkspaceInvite::query()
                ->where('email', '=', $email)
                ->where('workspace_id', '=', $workspace->id)
                ->get();

            if (count($invite) > 5) {
                throw WorkspaceException::inviteLimitExceeded();
            }

            // Generate a random token for the invite
            $token = bin2hex(random_bytes(32));

            // Date 4 weeks from now
            $expiresAt = now()->addWeeks(4);

            // Create a row in the workspace_invites table for this user.
            $workspaceInvite = (new WorkspaceInvite([
                'email' => $email,
                'workspace_id' => $workspace->id,
                'token' => $token,
                'expires_at' => $expiresAt,
            ]));

            $workspaceInvite->saveOrFail();

            $userSignupInvite = new UserSignupWorkspaceInvite();
            $userSignupInvite->workspaceInvite = $workspaceInvite;
            $userSignupInvite->workspace = $workspace;

            Mail::to($email)->send($userSignupInvite);

            return response()->json([
                'success' => true,
                'token' => $token, // TODO remove
            ]);
        }


        // Send the standard invite link
        // TODO send the invite link to the user.

        return response()->json([
            'success' => 'true',
        ]);
    }

    /**
     * @throws WorkspaceException
     */
    public function details(WorkspaceInvite $workspaceInvite): JsonResponse
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

    /**
     * Display a listing of the resource.
     *
     * @param Workspace $workspace
     * @return AnonymousResourceCollection
     */
    public function index(Workspace $workspace): AnonymousResourceCollection
    {
        $workspaceMembers = WorkspaceMembers::query()
            ->where('user_id', '=', auth()->user()->id)
            ->where('workspace_id', '=', $workspace->id)->get();

        return WorkspaceCollection::collection($workspaceMembers);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreWorkspaceMembersRequest $request
     * @return void
     */
    public function store(StoreWorkspaceMembersRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param WorkspaceMembers $workspaceMembers
     * @return Response
     */
    public function show(WorkspaceMembers $workspaceMembers)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateWorkspaceMembersRequest $request
     * @param WorkspaceMembers $workspaceMembers
     * @return Response
     */
    public function update(UpdateWorkspaceMembersRequest $request, WorkspaceMembers $workspaceMembers)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param WorkspaceMembers $workspaceMembers
     * @return Response
     */
    public function destroy(WorkspaceMembers $workspaceMembers)
    {
        //
    }
}
