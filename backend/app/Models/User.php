<?php

namespace App\Models;

use App\Notifications\VerifyApiEmail;
use App\Traits\TableUUID;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

/**
 * @property string $uuid
 * @property string $name
 * @property string $email
 * @property string $avatar
 */
class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, HasApiTokens, Notifiable, \Illuminate\Auth\MustVerifyEmail, HasRoles, SoftDeletes, TableUUID;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Sends out the email for email verification
     */
    public function sendApiEmailVerificationNotification(): void
    {
        $this->notify(new VerifyApiEmail);
    }

    /**
     * @return HasMany
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    /**
     * @return HasMany
     */
    public function boards(): HasMany
    {
        return $this->hasMany(Board::class);
    }

    /**
     * @return HasMany
     */
    public function workspaces(): HasMany
    {
        return $this->hasMany(Workspace::class);
    }

    public function workspaceMembers() {
        return $this->hasMany(WorkspaceMembers::class);
    }
}
