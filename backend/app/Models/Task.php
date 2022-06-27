<?php

namespace App\Models;

use App\Traits\TableUUID;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    use HasFactory, TableUUID;

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

    public static function statuses(): array
    {
        return [
            self::TODO,
            self::BLOCKED,
            self::IN_PROGRESS,
            self::DONE,
        ];
    }

    /**
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo
     */
    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }
}
