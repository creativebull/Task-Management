<?php

namespace App\Http\Resources\User;

use App\Core\Helpers\Date;
use App\Core\Permissions\UserPermissions;
use App\Http\Resources\Permission\RoleResource;
use App\Http\Resources\Permission\RoleResourceCollection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Spatie\Permission\Models\Role;

class UserResource extends JsonResource
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
            'email' => $this->email,
            'email_verified_at' => $this->email_verified_at ? $this->email_verified_at->format(Date::STANDARD_DATE_FORMAT) : '',
            'avatar' => $this->avatar,
            'created_at' => Date::toUserTime($this->created_at),
            'updated_at' => Date::toUserTime($this->updated_at),
            'roles' => new RoleResourceCollection(RoleResource::collection($this->roles)),
            'available_roles' => new RoleResourceCollection(RoleResource::collection(Role::all()->whereIn('name', UserPermissions::$roles))),
        ];
    }
}
