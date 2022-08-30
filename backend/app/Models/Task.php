<?php

namespace App\Models;

use App\Traits\TableUUID;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use HasFactory, TableUUID, SoftDeletes;

    public const TODO = 'todo';
    public const BLOCKED = 'blocked';
    public const IN_PROGRESS = 'in_progress';
    public const DONE = 'done';

    protected $fillable = [
        'identifier',
        'user_id',
        'assigned_to',
        'board_list_id',
        'name',
        'description',
        'position',
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

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * @return BelongsTo
     */
    public function boardList(): BelongsTo
    {
        return $this->belongsTo(BoardList::class);
    }
}
