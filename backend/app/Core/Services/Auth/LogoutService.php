<?php

namespace App\Core\Services\Auth;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class LogoutService
{
    public function logout(): JsonResponse
    {
        Auth::logout();
        return response()->json(['success' => true]);
    }
}
