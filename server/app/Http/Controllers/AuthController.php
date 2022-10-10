<?php

namespace App\Http\Controllers;

use App\Core\Services\Auth\LoginService;
use App\Core\Services\Auth\LogoutService;
use App\Core\Services\Auth\RegisterService;
use App\Core\Services\Auth\UserChangePasswordService;
use App\Core\Services\Auth\UserDetailsService;
use App\Core\Services\Auth\UserUpdateService;
use App\Exceptions\UserException;
use App\Http\Requests\Auth\ChangePasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterUserRequest;
use App\Http\Requests\Auth\UpdateUserRequest;
use App\Http\Resources\User\UserDetailsResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login API
     * @param LoginRequest $request
     * @return JsonResponse
     * @throws UserException
     */
    public function login(LoginRequest $request): JsonResponse
    {
        return (new LoginService())->login($request);
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
        return (new RegisterService())->register($request);
    }

    /**
     * @param UpdateUserRequest $request
     * @return JsonResponse
     * @throws ValidationException
     */
    public function update(UpdateUserRequest $request): JsonResponse
    {
        return (new UserUpdateService())->updateUser($request);
    }

    /**
     * @return UserDetailsResource
     */
    public function userDetails(): UserDetailsResource
    {
        return (new UserDetailsService())->userDetails();
    }

    /**
     * @param ChangePasswordRequest $request
     * @return JsonResponse
     * @throws ValidationException
     */
    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        return (new UserChangePasswordService())->changePassword($request);
    }

    /**
     * @return JsonResponse
     */
    public function logout(): JsonResponse
    {
        return (new LogoutService())->logout();
    }
}
