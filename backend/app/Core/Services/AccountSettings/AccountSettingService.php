<?php

namespace App\Core\Services\AccountSettings;

use App\Models\AccountSetting;
use Illuminate\Support\Arr;
use Throwable;

class AccountSettingService
{
    protected int $accountId = 0;
    protected static array $cachedSettings = [];

    /**
     * @param int $accountId
     * @return AccountSettingService
     */
    public function setAccountId(int $accountId): AccountSettingService
    {
        $this->accountId = $accountId;
        return $this;
    }

    /**
     * @param int $accountId
     * @return array
     */
    public function fetchAccountSettings(int $accountId): array
    {
        $cols = ['option', 'option_value'];
        $accountSpecificSettings = AccountSetting::query()
            ->where('account_id', '=', $accountId)
            ->get(['id', 'option', 'option_value'])
            ->keyBy('option')
            ->toArray();

        $accountSettingsForAccountIds = [];
        if (count($accountSpecificSettings) > 0) {
            foreach ($accountSpecificSettings as $accountSetting) {
                $accountSettingsForAccountIds[] = $accountSetting['id'];
            }
        }

        // Get the default options for the ones we dont have
        if (count($accountSettingsForAccountIds) > 0) {
            $accountDefaultSettings = AccountSetting::query()
                ->where('default_option', '=', 1)
                ->whereNotIn('id', $accountSettingsForAccountIds)
                ->get($cols)
                ->keyBy('option')
                ->toArray();
        } else {
            $accountDefaultSettings = AccountSetting::query()
                ->where('default_option', '=', 1)
                ->get($cols)
                ->keyBy('option')
                ->toArray();
        }

        // Remove ids from the account specific settings
        foreach ($accountSpecificSettings as $k => $accountSpecificSetting) {
            unset($accountSpecificSettings[$k]['id']);
        }

        // Overwrite the values from default with the ones from specific
        return array_merge($accountDefaultSettings, $accountSpecificSettings);
    }

    /**
     * @param string $setting
     * @param string $value
     * @return $this
     * @throws Throwable
     */
    public function updateAccountSetting(string $setting, string $value): self
    {
        $accountSetting = AccountSetting::query()
            ->where('account_id', '=', $this->accountId)
            ->where('option', '=', $setting)
            ->first();

        if ($accountSetting === null) {
            $accountSetting = new AccountSetting();
            $accountSetting->account_id = $this->accountId;
            $accountSetting->option = $setting;
        }
        $accountSetting->option_value = $value;

        $accountSetting->saveOrFail();

        return $this;
    }

    /**
     * @param int $accountId
     * @param string $option
     * @param string $default
     * @return string
     */
    public static function fetchSettingForAccount(int $accountId, string $option, string $default = ''): string
    {
        $cacheKey = "$accountId.$option";
        if (Arr::get(self::$cachedSettings, $cacheKey) !== null) {
            return Arr::get(self::$cachedSettings, $cacheKey);
        }
        $accountSettings = (new self())->fetchAccountSettings($accountId);
        $value = $accountSettings[$option]['option_value'] ?? $default;
        Arr::set(self::$cachedSettings, $cacheKey, $value);
        return $value;
    }
}
