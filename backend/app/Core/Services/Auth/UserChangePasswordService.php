<?php

namespace App\Core\Services\Auth;

use App\Http\Requests\Auth\ChangePasswordRequest;
use App\Notifications\PasswordChanged;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class UserChangePasswordService
{
    /**
     * Updates the users password
     *
     * @param ChangePasswordRequest $request
     * @return JsonResponse
     * @throws ValidationException
     */
    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        if (!password_verify($request->get('current_password'), Auth::user()->password)) {
            // The current password is wrong
            throw ValidationException::withMessages(['current_password' => 'The current password is incorrect']);
        }

        Auth::user()->password = bcrypt($request->get('new_password'));

        Auth::user()->save();

        Auth::user()->notify(new PasswordChanged());

        return response()->json(['success' => true]);
    }
}
