<?php

namespace App\Core\Services\Auth;

use App\Http\Resources\User\UserDetailsResource;
use Illuminate\Support\Facades\Auth;

class UserDetailsService
{
    /**
     * @return UserDetailsResource
     */
    public function userDetails(): UserDetailsResource
    {
        return new UserDetailsResource(Auth::user());
    }
}
