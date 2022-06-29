<?php

namespace App\Http\Requests\WorkspaceMembers;

use Illuminate\Foundation\Http\FormRequest;
use JetBrains\PhpStorm\ArrayShape;

class StoreWorkspaceMembersRequest extends FormRequest
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
    #[ArrayShape(['workspace_id' => "string[]", 'user_id' => "string[]"])]
    public function rules(): array
    {
        return [
            'workspace_id' => ['required', 'exists:workspaces', 'id'],
            'user_id' => ['required', 'exists:users', 'id'],
        ];
    }
}
