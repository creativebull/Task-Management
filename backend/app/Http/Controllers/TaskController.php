<?php

namespace App\Http\Controllers;

use App\Core\Services\Task\TaskAddService;
use App\Core\Services\Task\TaskDeleteService;
use App\Core\Services\Task\TaskUpdateService;
use App\Exceptions\BoardException;
use App\Exceptions\WorkspaceException;
use App\Http\Requests\Tasks\StoreTaskRequest;
use App\Http\Requests\Tasks\UpdateTaskRequest;
use App\Http\Resources\Task\TaskResource;
use App\Models\Board;
use App\Models\BoardList;
use App\Models\Task;
use App\Models\Workspace;
use Illuminate\Http\JsonResponse;
use Throwable;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        return response()->json();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreTaskRequest $request
     * @param Workspace $workspace
     * @param Board $board
     * @param BoardList $boardList
     * @return JsonResponse
     * @throws WorkspaceException
     * @throws Throwable
     */
    public function store(StoreTaskRequest $request, Workspace $workspace, Board $board, BoardList $boardList): JsonResponse
    {
        $task = (new TaskAddService())->addNewTask($request, $workspace, $board, $boardList);
        return response()->json(new TaskResource($task), 201);
    }

    /**
     * Display the specified resource.
     *
     * @param Task $task
     * @return JsonResponse
     */
    public function show(Task $task): JsonResponse
    {
        return response()->json(new TaskResource($task));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateTaskRequest $request
     * @param Task $task
     * @return JsonResponse
     * @throws WorkspaceException
     */
    public function update(UpdateTaskRequest $request, Task $task): JsonResponse
    {
        (new TaskUpdateService())->updateTask($request, $task->boardList->board->workspace, $task);

        return response()->json(new TaskResource($task));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Task $task
     * @return JsonResponse
     * @throws Throwable
     * @throws WorkspaceException
     * @throws BoardException
     */
    public function destroy(Task $task): JsonResponse
    {
        (new TaskDeleteService())->deleteTask($task);
        $task->delete();

        return response()->json(null, 204);
    }
}
