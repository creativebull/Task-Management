<?php

namespace App\Core\Services\Auth;

use App\Core\Services\AccountSettings\AccountSettingService;
use App\Http\Requests\Auth\ChangePasswordRequest;
use App\Http\Requests\Auth\RegisterUserRequest;
use App\Http\Requests\Auth\UpdateUserRequest;
use App\Http\Resources\Account\AccountResource;
use App\Http\Resources\User\UserDetailsResource;
use App\Models\Account;
use App\Models\User;
use App\Notifications\PasswordChanged;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Intervention\Image\Facades\Image;
use stdClass;

class AuthService
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

        // Check account can access this domain
        if (!$this->userCanAccessDomain($user, $request->header('origin'))) {
            throw ValidationException::withMessages(['email' => trans('does_not_belong_to_account')]);
        }

        return response()->json(['token' => $user->createToken('LaraPassport')->accessToken]);
    }

    /**
     * @param User $user
     * @param $requestOrigin
     * @return bool
     */
    private function userCanAccessDomain(User $user, $requestOrigin): bool
    {
        $account = Account::query()->where('id', '=', 1)->firstOrFail();

        $accountURL = $account->url;

        // Allow all URL
        if ($accountURL === '*') {
            return true;
        }

        // Ensure there is a slash on the end of the urls
        $accountURL = rtrim($accountURL, '/');
        $requestOrigin = rtrim($requestOrigin, '/');

        return ($requestOrigin === $accountURL);
    }

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
        $response = new stdClass();

        $response->data['token'] = $user->createToken('LaraPassport')->accessToken;

        $response->data['user'] = [
            'uuid' => $user->uuid,
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => $user->avatar,
            'is_verified' => $user->hasVerifiedEmail()
        ];

        return response()->json($response);
    }

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

        $response = new stdClass();
        $response->success = true;
        $response->data['user'] = new UserDetailsResource(Auth::user());

        return response()->json($response);
    }

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

    /**
     * @return array
     */
    public function userDetailsArray(): array
    {
        /** @var User $user */
        $user = Auth::user();

        if (!$user) {
            return [];
        }

        $allPermissions = $user->getAllPermissions();

        $permissions = [];
        foreach ($allPermissions as $permission) {
            $permissions[] = $permission->name;
        }

        return [
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => $user->avatar,
            'is_verified' => $user->hasVerifiedEmail(),
            'created_at' => $user->created_at->diffForHumans(),
            'permissions' => $permissions,
            'account' => new AccountResource($user->account),
            'account_options' => (new AccountSettingService())->fetchAccountSettings($user->account_id)
        ];
    }
}
