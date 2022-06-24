<?php

namespace App\Http\Resources\User;


use App\Core\Helpers\Date;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserDetailsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request): array
    {
        $allPermissions = $this->getAllPermissions();

        $permissions = [];
        foreach ($allPermissions as $permission) {
            $permissions[] = $permission->name;
        }

        return [
            'uuid' => $this->uuid,
            'name' => $this->name,
            'email' => $this->email,
            'avatar' => $this->avatar,
            'is_verified' => $this->hasVerifiedEmail(),
            'created_at' => (new Carbon(Date::toAccountTime($this->created_at)))->diffForHumans(),
            'permissions' => $permissions,
        ];
    }
}
