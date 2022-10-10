<?php

namespace App\Http\Resources\BoardLists;

use App\Http\Resources\Task\TaskResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BoardListWithTasksResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request): array
    {
        return [
            'uuid' => $this->uuid,
            'name' => $this->name,
            'position' => $this->position,
            'tasks' => TaskResource::collection($this->tasks),
        ];
    }
}
