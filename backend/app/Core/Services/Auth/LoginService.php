<?php

namespace App\Core\Services\Auth;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class LoginService
{
    /**
     * Sorts out the user login
     *
     * @param Request $request
     * @return JsonResponse
     * @throws ValidationException
     */
    public function login(Request $request): JsonResponse
    {
        if (!Auth::attempt(['email' => $request->get('email'), 'password' => $request->get('password')])) {
            throw ValidationException::withMessages(['email' => trans('auth.failed')]);
        }

        $user = Auth::user();

        // In the case that the user is null
        if ($user === null) {
            throw ValidationException::withMessages(['user' => 'Use could not be found']);
        }

        return response()->json(['token' => $user->createToken('LaraPassport')->accessToken]);
    }
}
