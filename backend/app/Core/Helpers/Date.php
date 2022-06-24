<?php

namespace App\Core\Helpers;

use App\Core\Services\AccountSettings\AccountSettingService;
use Carbon\Carbon;
use Exception;

class Date
{
    public const STANDARD_DATE_FORMAT = 'Y-m-d H:i:s';

    protected static string $timezone = 'Europe/London';
    protected static bool $gotTimezone = false;

    /**
     * @param string|null $date
     * @return string
     */
    public static function toAccountTime(?string $date): ?string
    {
        $timezone = self::accountTimezone();

        if (empty($date)) {
            return '';
        }

        return (new Carbon($date, 'UTC'))->setTimezone($timezone)->format(self::STANDARD_DATE_FORMAT);
    }

    /**
     * @param $date
     * @return string
     */
    public static function toUTC($date): string
    {
        $timezone = self::accountTimezone();

        if (empty($date)) {
            return '';
        }

        return (new Carbon($date, $timezone))->setTimezone('UTC')->format(self::STANDARD_DATE_FORMAT);
    }

    /**
     * @return string
     */
    private static function accountTimezone(): string
    {
        $timezone = self::$timezone;
        if (!self::$gotTimezone) {
            $defaultTimezone = env('timezone', 'Europe/London');
            if (isset(auth()->user()->account_id)) {
                $timezone = AccountSettingService::fetchSettingForAccount(
                    auth()->user()->account_id,
                    'timezone',
                    $defaultTimezone
                );
            } else {
                $timezone = $defaultTimezone;
            }
        }

        return $timezone;
    }

    /**
     * @param $sStartDate
     * @param $sEndDate
     * @param string $sFormat
     * @return false|string
     * @throws Exception
     */
    public static function randomDate($sStartDate, $sEndDate, $sFormat = 'Y-m-d H:i:s')
    {
        // Convert the supplied date to timestamp
        $fMin = strtotime($sStartDate);
        $fMax = strtotime($sEndDate);
        // Generate a random number from the start and end dates
        $fVal = random_int($fMin, $fMax);
        // Convert back to the specified date format
        return date($sFormat, $fVal);
    }
}
