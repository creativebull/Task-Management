<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;

trait TableUUID
{
    /**
     * Upon boot add the uuid
     */
    protected static function boot(): void
    {
        parent::boot();

        static::creating(static function ($model) {
            $model->uuid = (string)$model->generateUuid();
        });
    }

    /**
     * Function to generate an Uuid
     *
     * @return UuidInterface
     */
    protected function generateUuid(): UuidInterface
    {
        return Uuid::uuid4();
    }

    public function setUuId(string $uuid) {
        $this->uuid = $uuid;
        return $this;
    }

    /**
     * @return Model|Builder|null
     */
    public function loadFromUUID(): Model|Builder|null
    {
        return self::query()->where('uuid', '=', $this->uuid)->first();
    }

    /**
     * @param string $uuid
     * @return Model|Builder|null
     */
    public static function fromUuId(string $uuid): Model|Builder|null
    {
        return self::query()->where('uuid', '=', $uuid)->first();
    }
}
