<?php

namespace App\Http\Controllers;

use App\Core\Services\WorkspaceInvite\WorkspaceInviteAcceptService;
use App\Core\Services\WorkspaceInvite\WorkspaceInviteDetailsService;
use App\Core\Services\WorkspaceInvite\WorkspaceInviteService;
use App\Exceptions\UserException;
use App\Exceptions\WorkspaceException;
use App\Http\Requests\WorkspaceMembers\StoreWorkspaceMembersRequest;
use App\Http\Requests\WorkspaceMembers\UpdateWorkspaceMembersRequest;
use App\Http\Requests\WorkspaceMembers\WorkspaceMemberInviteRequest;
use App\Http\Resources\Workspace\WorkspaceCollection;
use App\Models\Workspace;
use App\Models\WorkspaceInvite;
use App\Models\WorkspaceMembers;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
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
        return WorkspaceInviteService::inviteEmail($request);
    }

    /**
     * @throws WorkspaceException
     */
    public function details(WorkspaceInvite $workspaceInvite): JsonResponse
    {
        return WorkspaceInviteDetailsService::workspaceInviteDetails($workspaceInvite);
    }

    /**
     * @throws UserException
     * @throws WorkspaceException
     */
    public function accept(WorkspaceInvite $workspaceInvite): JsonResponse
    {
        return WorkspaceInviteAcceptService::acceptInvite($workspaceInvite);
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
