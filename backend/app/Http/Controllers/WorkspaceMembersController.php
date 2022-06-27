<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWorkspaceMembersRequest;
use App\Http\Requests\UpdateWorkspaceMembersRequest;
use App\Http\Resources\Workspace\WorkspaceCollection;
use App\Models\Workspace;
use App\Models\WorkspaceMembers;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class WorkspaceMembersController extends Controller
{
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
     * @param \App\Models\WorkspaceMembers $workspaceMembers
     * @return Response
     */
    public function show(WorkspaceMembers $workspaceMembers)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \App\Http\Requests\UpdateWorkspaceMembersRequest $request
     * @param \App\Models\WorkspaceMembers $workspaceMembers
     * @return Response
     */
    public function update(UpdateWorkspaceMembersRequest $request, WorkspaceMembers $workspaceMembers)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Models\WorkspaceMembers $workspaceMembers
     * @return Response
     */
    public function destroy(WorkspaceMembers $workspaceMembers)
    {
        //
    }
}
