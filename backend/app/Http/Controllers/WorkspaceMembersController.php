<?php

namespace App\Http\Controllers;

use App\Exceptions\WorkspaceException;
use App\Http\Requests\StoreWorkspaceMembersRequest;
use App\Http\Requests\UpdateWorkspaceMembersRequest;
use App\Http\Requests\WorkspaceMembers\WorkspaceMemberInviteRequest;
use App\Http\Resources\Workspace\WorkspaceCollection;
use App\Mail\UserSignupWorkspaceInvite;
use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceMembers;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Mail;

class WorkspaceMembersController extends Controller
{
    /**
     * @throws WorkspaceException
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

            $userSignupInvite = new UserSignupWorkspaceInvite();
            $userSignupInvite->workspace = $workspace;

            Mail::to($email)->send($userSignupInvite);

            return response()->json([
                'success' => true,
                'message' => 'Test,'
            ]);
        }



        // Send the standard invite link
        // TODO send the invite link to the user.

        return response()->json([
            'success' => 'true',
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
