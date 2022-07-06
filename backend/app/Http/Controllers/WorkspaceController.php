<?php

namespace App\Http\Controllers;

use App\Exceptions\WorkspaceException;
use App\Http\Requests\Workspace\StoreWorkspaceRequest;
use App\Http\Requests\Workspace\UpdateWorkspaceRequest;
use App\Http\Resources\Workspace\WorkspaceCollection;
use App\Http\Resources\Workspace\WorkspaceResource;
use App\Models\Workspace;
use Illuminate\Http\JsonResponse;

class WorkspaceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     */
    public function index(): JsonResponse
    {
        $workspaces = Workspace::query()->with(['user'])->where('user_id', '=', auth()->user()->id)->get();

        return response()->json(new WorkspaceCollection(WorkspaceResource::collection($workspaces)));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreWorkspaceRequest $request
     * @return JsonResponse
     * @throws WorkspaceException
     */
    public function store(StoreWorkspaceRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $validated['user_id'] = auth()->user()->id;

        $workspace = new Workspace($validated);

        // Check if there is already a workspace with the same name
        $existingWorkspace = Workspace::query()->where('user_id', '=', auth()->user()->id)->where('name', '=', $workspace->name)->first();

        if ($existingWorkspace) {
            throw WorkspaceException::workspaceSameName();
        }

        $workspace = Workspace::query()->create($validated);

        return response()->json(new WorkspaceResource($workspace));
    }

    /**
     * Display the specified resource.
     *
     * @param Workspace $workspace
     * @return JsonResponse
     */
    public function show(Workspace $workspace): JsonResponse
    {
        return response()->json(new WorkspaceResource($workspace));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateWorkspaceRequest $request
     * @param Workspace $workspace
     * @return JsonResponse
     */
    public function update(UpdateWorkspaceRequest $request, Workspace $workspace): JsonResponse
    {
        $workspace->update($request->validated());

        return response()->json(new WorkspaceResource($workspace));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Workspace $workspace
     * @return JsonResponse
     */
    public function destroy(Workspace $workspace): JsonResponse
    {
        $workspace->members()->delete();
        $workspace->delete();

        return response()->json(['success' => true]);
    }
}
