<?php

namespace App\Http\Controllers;

use App\Core\Services\Auth\AuthService;
use App\Http\Requests\Auth\RegisterUserRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login API
     * @param Request $request
     * @return JsonResponse
     * @throws ValidationException
     */
    public function login(Request $request): JsonResponse
    {
        return (new AuthService())->login($request);
    }

    /**
     * Register API
     *
     * @param RegisterUserRequest $request
     * @return JsonResponse
     * @throws ValidationException
     */
    public function register(RegisterUserRequest $request): JsonResponse
    {
        return (new AuthService())->register($request);
    }
}
