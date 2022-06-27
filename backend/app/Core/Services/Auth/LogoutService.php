<?php

namespace App\Core\Services\Auth;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class LogoutService
{
    public function logout(): JsonResponse
    {
        if (Auth::user() !== null) {
            Auth::user()->token()->revoke();
        }
        return response()->json(['success' => true]);
    }
}
