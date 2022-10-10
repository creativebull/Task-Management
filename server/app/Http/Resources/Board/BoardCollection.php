<?php

namespace App\Http\Resources\Board;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use JetBrains\PhpStorm\ArrayShape;
use JsonSerializable;
use Illuminate\Support\Collection;

class BoardCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param Request $request
     * @return array
     */
    #[ArrayShape(['data' => Collection::class])]
    public function toArray($request): array
    {
        return [
            'data' => $this->collection,
        ];
    }
}
