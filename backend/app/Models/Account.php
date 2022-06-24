<?php

namespace App\Models;

use App\Traits\TableUUID;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Class Account
 * @package App\Models
 *
 * @property int $id;
 * @property int $parent_id;
 * @property string $name;
 * @property string $url;
 * @property string account_email
 * @property string account_address
 * @property string account_postcode
 * @property string account_country
 * @property string created_at
 * @property string updated_at
 */
class Account extends Model
{
    use HasFactory, TableUUID;

    protected $fillable = [
        'parent_id',
        'name',
        'url',
        'account_email',
        'account_address',
        'account_postcode',
        'account_country',
        'account_phone_number',
        'website_address',
    ];

    /**
     * @return HasMany
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
