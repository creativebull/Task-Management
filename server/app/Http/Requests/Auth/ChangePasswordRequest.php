<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class ChangePasswordRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'current_password' => ['required', 'min:7', 'max:255'],
            'new_password' => ['required', 'min:7', 'max:255', 'different:current_password'],
            'new_password_repeat' => ['required', 'same:new_password', 'max:255'],
        ];
    }
}
