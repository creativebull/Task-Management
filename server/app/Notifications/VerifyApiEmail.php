<?php

namespace App\Notifications;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\URL;
use Illuminate\Auth\Notifications\VerifyEmail;

class VerifyApiEmail extends VerifyEmail
{
    /**
     * Get the verification URL for the given notifiable.
     *
     * @param mixed $notifiable
     * @return string
     */
    protected function verificationUrl($notifiable): string
    {
        // This will basically mimic the email endpoint with get request
        return URL::temporarySignedRoute(
            'verificationapi.verify',
            Carbon::now()->addMinutes(120),
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification())
            ]
        );
    }
}
