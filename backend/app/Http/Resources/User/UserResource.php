<?php

namespace App\Http\Resources\User;

use App\Core\Helpers\Date;
use App\Core\Permissions\StaffPermissions;
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
            'id' => $this->id,
            'account_id' => $this->account_id,
            'account_name' => $this->account->name,
            'name' => $this->name,
            'email' => $this->email,
            'email_verified_at' => $this->email_verified_at->format(Date::STANDARD_DATE_FORMAT),
            'avatar' => $this->avatar,
            'created_at' => Date::toAccountTime($this->created_at),
            'updated_at' => Date::toAccountTime($this->updated_at),
            'roles' => new RoleResourceCollection(RoleResource::collection($this->roles)),
            'available_roles' => new RoleResourceCollection(RoleResource::collection(Role::all()->whereIn('name', StaffPermissions::$roles))),
        ];
    }
}
