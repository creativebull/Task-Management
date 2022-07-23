<?php

namespace App\Http\Controllers;

use App\Core\Services\BoardList\BoardListDeleteService;
use App\Core\Services\BoardList\BoardListUpdateService;
use App\Core\Services\Workspace\WorkspacePermissionService;
use App\Exceptions\WorkspaceException;
use App\Http\Requests\StoreBoardListRequest;
use App\Http\Requests\UpdateBoardListRequest;
use App\Http\Resources\BoardLists\BoardListWithTasksCollection;
use App\Http\Resources\BoardLists\BoardListWithTasksResource;
use App\Models\Board;
use App\Models\BoardList;
use App\Models\Workspace;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Throwable;

class BoardListController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     */
    public function listsForBoard(Workspace $workspace, Board $board)
    {
        // Ensure the user has access to this workspace
        if (!WorkspacePermissionService::userHasAccessToWorkspace(auth()->user(), $workspace)) {
            // TODO change to exception
            return response()->json(['success' => false, 'errorMessages' => ['You do not have access to this workspace']], 403);
        }

        // Get the board lists with tasks
        $boardLists = BoardList::query()
            ->with('tasks')
            ->where('board_id', '=', $board->id)
            ->orderBy('position', 'asc')
            ->get();

        return response()->json(BoardListWithTasksResource::collection($boardLists));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Workspace $workspace
     * @param Board $board
     * @param StoreBoardListRequest $request
     * @return JsonResponse
     * @throws Throwable
     */
    public function store(Workspace $workspace, Board $board, StoreBoardListRequest $request): JsonResponse
    {
        // Ensure the user has access to this workspace
        if (!WorkspacePermissionService::userHasAccessToWorkspace(auth()->user(), $workspace)) {
            // TODO change to exception
            return response()->json(['success' => false, 'errorMessages' => ['You do not have access to this workspace']], 403);
        }

        // Find the next position for the board list
        $nextPosition = BoardList::query()->where('board_id', '=', $board->id)->max('position') + 1;

        $validatedData = $request->validated();
        $validatedData['board_id'] = $board->id;
        $validatedData['position'] = $nextPosition;

        // Create the board list
        $boardList = new BoardList($validatedData);

        $boardList->saveOrFail();

        return response()->json(new BoardListWithTasksResource($boardList), Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     *
     * @param BoardList $boardList
     * @return Response
     */
    public function show(BoardList $boardList)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateBoardListRequest $request
     * @param Workspace $workspace
     * @param Board $board
     * @param BoardList $boardList
     * @return Response
     * @throws Throwable
     * @throws WorkspaceException
     */
    public function update(UpdateBoardListRequest $request, Workspace $workspace, Board $board, BoardList $boardList)
    {
        (new BoardListUpdateService())->updateBoardList($workspace, $board, $boardList, $request->validated());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Workspace $workspace
     * @param Board $board
     * @param BoardList $boardList
     * @return JsonResponse
     * @throws WorkspaceException
     */
    public function destroy(Workspace $workspace, Board $board, BoardList $boardList): JsonResponse
    {
        (new BoardListDeleteService())->deleteBoardList($workspace, $board, $boardList);

        return response()->json(['success' => true]);
    }
}
