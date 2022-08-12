<?php

namespace App\Core\Services\Auth;

use App\Models\User;
use Illuminate\Contracts\Auth\Authenticatable;

class AuthHelper
{
    /**
     * @return Authenticatable|User
     */
    public static function getLoggedInUser(): ?Authenticatable
    {
        return auth()->user();
    }
}
