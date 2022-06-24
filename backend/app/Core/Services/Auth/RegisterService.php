<?php

namespace App\Core\Services\Auth;

use App\Http\Requests\Auth\RegisterUserRequest;
use App\Models\User;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Intervention\Image\Facades\Image;

class RegisterService
{
    /**
     * Deals with registering a new user
     *
     * @param RegisterUserRequest $request
     * @return JsonResponse
     * @throws ValidationException
     */
    public function register(RegisterUserRequest $request): JsonResponse
    {
        // Check if we have an image
        if (request('avatar')) {
            $imagePath = request('avatar')->store('profile', 'public');

            Image::make(public_path("storage/{$imagePath}"))
                ->fit(1000, 1000)
                ->save();
            $imageArray = ['avatar' => $imagePath];
        }

        // Get the data for the account from the request
        $postArray = $request->all();

        // Encrypt the password
        $postArray['password'] = bcrypt($postArray['password']);

        $accountId = 1; // TODO create the account system

        if ($accountId === 0) {
            throw ValidationException::withMessages(['account' => 'Host does not match any account']);
        }

        $postArray['account_id'] = $accountId;

        // Merge in the image if there is one
        $postArray = array_merge($postArray, $imageArray ?? []);

        /** @var User $user */
        $user = User::query()->create($postArray);

        try {
            $user->sendApiEmailVerificationNotification();
        } catch (Exception $e) {
            Log::error('Failed to notify staff member of new account: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'data' => [
                'token' => $user->createToken('LaraPassport')->accessToken,
                'user' => [
                    'uuid' => $user->uuid,
                    'name' => $user->name,
                    'email' => $user->email,
                    'avatar' => $user->avatar,
                    'is_verified' => $user->hasVerifiedEmail(),
                ],
            ],
        ]);
    }
}
