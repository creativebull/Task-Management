<?php

namespace App\Models;

use App\Traits\TableUUID;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int account_id
 * @property string option
 * @property string option_value
 * @property int default_option
 */
class AccountSetting extends Model
{
    use TableUUID;
}
