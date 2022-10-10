<?php

namespace App\Http\Requests\WorkspaceMembers;

use Illuminate\Foundation\Http\FormRequest;
use JetBrains\PhpStorm\ArrayShape;

class WorkspaceMemberInviteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    #[ArrayShape(['email' => "string[]", 'workspace_uuid' => "string[]"])]
    public function rules(): array
    {
        return [
            'email' => ['required', 'email'],
            'workspace_uuid' => ['required', 'uuid'],
        ];
    }
}
