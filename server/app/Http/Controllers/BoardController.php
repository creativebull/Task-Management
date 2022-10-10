<?php

namespace App\Http\Controllers;

use App\Core\Services\Board\BoardCreateService;
use App\Core\Services\Board\BoardDeleteService;
use App\Core\Services\Board\BoardUpdateService;
use App\Exceptions\BoardException;
use App\Exceptions\WorkspaceException;
use App\Http\Requests\StoreBoardRequest;
use App\Http\Requests\UpdateBoardRequest;
use App\Http\Resources\Board\BoardCollection;
use App\Http\Resources\Board\BoardResource;
use App\Models\Board;
use App\Models\Workspace;
use Illuminate\Http\JsonResponse;
use Throwable;

class BoardController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Workspace $workspace
     * @return JsonResponse
     */
    public function index(Workspace $workspace): JsonResponse
    {
        return response()->json(new BoardCollection(BoardResource::collection($workspace->boards)));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreBoardRequest $request
     * @param Workspace $workspace
     * @return JsonResponse
     * @throws BoardException
     * @throws Throwable
     */
    public function store(StoreBoardRequest $request, Workspace $workspace): JsonResponse
    {
        $board = (new BoardCreateService())->createBoard($request->validated(), $workspace, $request->file('image'));
        return response()->json(new BoardResource($board), 201);
    }

    /**
     * Display the specified resource.
     *
     * @param Workspace $workspace
     * @param Board $board
     * @return JsonResponse
     * @throws WorkspaceException
     */
    public function show(Workspace $workspace, Board $board): JsonResponse
    {
        if ($workspace->user->id !== auth()->user()->id) {
            throw WorkspaceException::workspaceNotFound();
        }
        return response()->json(new BoardResource($board));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateBoardRequest $request
     * @param Workspace $workspace
     * @param Board $board
     * @return JsonResponse
     * @throws WorkspaceException
     */
    public function update(UpdateBoardRequest $request, Workspace $workspace, Board $board): JsonResponse
    {
        $board = (new BoardUpdateService())->updateBoard($board, $request->validated(), $workspace, $request->file('image'));
        return response()->json(new BoardResource($board));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Workspace $workspace
     * @param Board $board
     * @return JsonResponse
     * @throws BoardException
     * @throws WorkspaceException
     */
    public function destroy(Workspace $workspace, Board $board): JsonResponse
    {
        (new BoardDeleteService())->deleteBoard($board, $workspace);

        return response()->json(null, 204);
    }
}
