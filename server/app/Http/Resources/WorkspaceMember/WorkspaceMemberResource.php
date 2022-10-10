<?php

namespace App\Http\Resources\WorkspaceMember;

use App\Http\Resources\User\UserBasicResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkspaceMemberResource extends JsonResource
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
            'user' => new UserBasicResource(User::find($this->user_id)),
        ];
    }
}
