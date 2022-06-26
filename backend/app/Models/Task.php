<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    use HasFactory;

    public const TODO = 'todo';
    public const BLOCKED = 'blocked';
    public const IN_PROGRESS = 'in_progress';
    public const DONE = 'done';

    protected $fillable = [
        'identifier',
        'user_id',
        'name',
        'description',
        'status',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function statuses(): array
    {
        return [
            self::TODO,
            self::BLOCKED,
            self::IN_PROGRESS,
            self::DONE,
        ];
    }
}
