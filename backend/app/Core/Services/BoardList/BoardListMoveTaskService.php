<?php

namespace App\Core\Services\BoardList;

use App\Core\Services\Auth\AuthHelper;
use App\Core\Services\Workspace\WorkspacePermissionService;
use App\Exceptions\WorkspaceException;
use App\Models\Board;
use App\Models\BoardList;
use App\Models\Task;
use App\Models\Workspace;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Throwable;

class BoardListMoveTaskService
{
    /**
     * @param Workspace $workspace
     * @param Board $board
     * @param Request $request
     * @return JsonResponse|void
     * @throws WorkspaceException
     * @throws Throwable
     */
    public function moveTask(Workspace $workspace, Board $board, Request $request)
    {
        // Ensure the user has access to this workspace
        if (!WorkspacePermissionService::userHasAccessToWorkspace(AuthHelper::getLoggedInUser(), $workspace)) {
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
    }
}
