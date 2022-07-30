<?php

namespace App\Http\Controllers;

use App\Core\Services\BoardList\BoardListDeleteService;
use App\Core\Services\BoardList\BoardListUpdateService;
use App\Core\Services\Workspace\WorkspacePermissionService;
use App\Exceptions\WorkspaceException;
use App\Http\Requests\StoreBoardListRequest;
use App\Http\Requests\UpdateBoardListRequest;
use App\Http\Resources\BoardLists\BoardListWithTasksResource;
use App\Models\Board;
use App\Models\BoardList;
use App\Models\Task;
use App\Models\Workspace;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use Throwable;

class BoardListController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @throws WorkspaceException
     */
    public function listsForBoard(Workspace $workspace, Board $board): JsonResponse
    {
        // Ensure the user has access to this workspace
        if (!WorkspacePermissionService::userHasAccessToWorkspace(auth()->user(), $workspace)) {
            throw WorkspaceException::noAccessToWorkspace();
        }

        // Get the board lists with tasks
        $boardLists = BoardList::query()
            ->with(['tasks' => function ($query) {
                $query->orderBy('position', 'asc');
            }])
            ->where('board_id', '=', $board->id)
            ->orderBy('position')
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
            throw WorkspaceException::noAccessToWorkspace();
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
     * @throws Throwable
     * @throws WorkspaceException
     */
    public function reorder(Workspace $workspace, Board $board, BoardList $boardList, Request $request): JsonResponse
    {
        // Ensure the user has access to this workspace
        if (!WorkspacePermissionService::userHasAccessToWorkspace(auth()->user(), $workspace)) {
            throw WorkspaceException::noAccessToWorkspace();
        }

        // Make sure the board belongs to the workspace
        if ($board->workspace_id !== $workspace->id) {
            throw WorkspaceException::noAccessToWorkspace();
        }

        // Make sure the board list belongs to the board
        if ($boardList->board_id !== $board->id) {
            throw WorkspaceException::noAccessToWorkspace();
        }

        $taskUuIds = $request->get('uuids');

        $tasks = Task::query()->whereIn('uuid', $taskUuIds)->get('id');

        if (count($tasks) !== count($taskUuIds)) {
            return response()->json(['error' => 'Invalid task UUIDs'], Response::HTTP_BAD_REQUEST);
        }

        $position = 1;
        foreach ($taskUuIds as $taskUuId) {
            $task = Task::query()->where('uuid', '=', $taskUuId)->first();
            if (!$task) {
                continue;
            }
            $task->position = $position;
            $task->saveOrFail();
            $position++;
        }

        return response()->json(null, Response::HTTP_OK);
    }

    public function moveTask(Workspace $workspace, Board $board, Request $request): JsonResponse
    {
        // Ensure the user has access to this workspace
        if (!WorkspacePermissionService::userHasAccessToWorkspace(auth()->user(), $workspace)) {
            throw WorkspaceException::noAccessToWorkspace();
        }

        // Make sure the board belongs to the workspace
        if ($board->workspace_id !== $workspace->id) {
            throw WorkspaceException::noAccessToWorkspace();
        }

        // Get the from list
        $fromList = $request->get('fromListUuId');
        // Get the to list
        $toList = $request->get('toListUuId');

        $fromList = BoardList::query()->where('uuid', '=', $fromList)->firstOrFail();
        $toList = BoardList::query()->where('uuid', '=', $toList)->firstOrFail();

        // Make sure the board lists belong to the board
        if ($fromList->board_id !== $board->id || $toList->board_id !== $board->id) {
            throw WorkspaceException::noAccessToWorkspace();
        }

        // Get the list of tasks from the from list
        $fromListUuIds = $request->get('fromListUuIds');
        // Get the list of tasks from the to list
        $toListUuIds = $request->get('toListUuIds');

        // Make sure all the from tasks exist
        $fromTasks = Task::query()->whereIn('uuid', $fromListUuIds)->get('id');
        if (count($fromTasks) !== count($fromListUuIds)) {
            return response()->json(['error' => 'Invalid task UUIDs'], Response::HTTP_BAD_REQUEST);
        }

        // Make sure all the to tasks exist
        $toTasks = Task::query()->whereIn('uuid', $toListUuIds)->get('id');
        if (count($toTasks) !== count($toListUuIds)) {
            return response()->json(['error' => 'Invalid task UUIDs'], Response::HTTP_BAD_REQUEST);
        }

        $position = 1;
        foreach ($fromListUuIds as $taskUuId) {
            $task = Task::query()->where('uuid', '=', $taskUuId)->first();
            if (!$task) {
                continue;
            }
            $task->position = $position;
            $task->board_list_id = $fromList->id;
            $task->saveOrFail();
            $position++;
        }

        $position = 1;
        foreach ($toListUuIds as $taskUuId) {
            $task = Task::query()->where('uuid', '=', $taskUuId)->first();
            if (!$task) {
                continue;
            }
            $task->position = $position;
            $task->board_list_id = $toList->id;
            $task->saveOrFail();
            $position++;
        }

        return response()->json(null, Response::HTTP_OK);
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
