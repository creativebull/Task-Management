<?php

namespace App\Http\Resources\Account;


use App\Core\Helpers\Date;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AccountResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request): array
    {
        return [
            'uuid' => $this->uuid,
            'name' => $this->name,
            'url' => $this->url,
            'avatar' => $this->avatar,
            'account_email' => $this->account_email,
            'account_address' => $this->account_address,
            'account_postcode' => $this->account_postcode,
            'account_country' => $this->account_country,
            'account_phone_number' => $this->account_phone_number,
            'website_address' => $this->website_address,
            'created_at' => Date::toAccountTime($this->created_at),
            'updated_at' => Date::toAccountTime($this->updated_at),
        ];
    }
}
