@component('mail::message')
Hi {{ auth()->user()->name }}, has invited you to join the workspace {{ $workspace->name }}

To accept the invitation, please click the button below.

@component('mail::button', ['url' => $url])
Accept Invitation
@endcomponent

If you did not request to join the workspace, please ignore this email.

Thanks,<br>
{{ config('app.name') }}
@endcomponent
