<?php

namespace App\Http\Resources\Workspace;

use App\Core\Helpers\Date;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JetBrains\PhpStorm\ArrayShape;
use App\Http\Resources\Workspace\WorkspaceUserResource;

class WorkspaceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    #[ArrayShape(['uuid' => "mixed", 'name' => "mixed", 'description' => "mixed", 'user' => WorkspaceUserResource::class, 'created_at' => "null|string", 'updated_at' => "null|string"])]
    public function toArray($request): array
    {
        return [
            'uuid' => $this->uuid,
            'name' => $this->name,
            'description' => $this->description,
            'user' => new WorkspaceUserResource($this->user),
            'created_at' => Date::toUserTime($this->created_at),
            'updated_at' => Date::toUserTime($this->updated_at),
        ];
    }
}
