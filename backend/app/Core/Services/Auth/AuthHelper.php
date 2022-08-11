<?php

namespace App\Core\Services\Auth;

use Illuminate\Contracts\Auth\Authenticatable;

class AuthHelper
{
    public static function getLoggedInUser(): ?Authenticatable
    {
        return auth()->user();
    }
}
