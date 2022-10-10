<?php

namespace App\Core\Services\Auth;

use App\Http\Requests\Auth\UpdateUserRequest;
use App\Http\Resources\User\UserDetailsResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Intervention\Image\Facades\Image;

class UserUpdateService
{
    /**
     * @param UpdateUserRequest $request
     * @return JsonResponse
     * @throws ValidationException
     */
    public function updateUser(UpdateUserRequest $request): JsonResponse
    {
        $newEmail = $request->get('email');
        $oldEmail = Auth::user()->email;

        if ($newEmail !== $oldEmail) {
            // Check if the email exists
            $result = User::query()->where('email', '=', $newEmail)->count();

            if ($result > 0) {
                throw ValidationException::withMessages(['user' => 'User does not exist']);
            }

            Auth::user()->email = $newEmail;

            // Unauth the email
            Auth::user()->email_verified_at = null;
            Auth::user()->sendApiEmailVerificationNotification();
        }

        if (request('avatar')) {
            $imagePath = request('avatar')->store('profile', 'public');

            Image::make(public_path("storage/{$imagePath}"))
                ->fit(1000, 1000)
                ->save();
            Auth::user()->avatar = $imagePath;
        }

        Auth::user()->name = $request->get('name');

        Auth::user()->save();

        return response()->json([
            'success' => true,
            'data' => [
                'user' => new UserDetailsResource(Auth::user()),
            ],
        ]);
    }
}
