<?php

namespace App\Http\Resources\WorkspaceInvite;

use App\Core\Helpers\Date;
use App\Http\Resources\Workspace\WorkspaceResource;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class WorkspaceInviteResource extends JsonResource
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
            'email' => $this->email,
            'workspace' => new WorkspaceResource($this->workspace),
            'token' => $this->token,
            'expires_at' => $this->expires_at,
            'created_at' => Date::toUserTime($this->created_at),
            'updated_at' => Date::toUserTime($this->updated_at),
        ];
    }
}
