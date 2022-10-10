<?php

namespace App\Core\Services\Auth;

use App\Exceptions\UserException;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class LoginService
{
    /**
     * Sorts out the user login
     *
     * @param LoginRequest $request
     * @return JsonResponse
     * @throws UserException
     */
    public function login(LoginRequest $request): JsonResponse
    {
        if (!Auth::attempt(['email' => $request->get('email'), 'password' => $request->get('password')])) {
            throw UserException::invalidLogin();
        }

        $user = Auth::user();

        // In the case that the user is null
        if ($user === null) {
            throw UserException::userNotFound();
        }

        return response()->json(['token' => $user->createToken('LaraPassport')->accessToken]);
    }
}
