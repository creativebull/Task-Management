<?php

namespace App\Http\Resources\Workspace;

use App\Core\Helpers\Date;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkspaceResource extends JsonResource
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
            'created_at' => Date::toUserTime($this->created_at),
            'updated_at' => Date::toUserTime($this->updated_at),
        ];
    }
}
