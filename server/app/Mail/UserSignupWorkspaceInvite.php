<?php

namespace App\Mail;

use App\Models\Workspace;
use App\Models\WorkspaceInvite;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class UserSignupWorkspaceInvite extends Mailable
{
    use Queueable, SerializesModels;

    public WorkspaceInvite $workspaceInvite;
    public Workspace $workspace;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build(): static
    {
        return $this->markdown('emails.workspace.user-invite', [
            'url' => env('APP_URL') . '/workspace-signup/' . $this->workspaceInvite->token,
        ]);
    }
}
