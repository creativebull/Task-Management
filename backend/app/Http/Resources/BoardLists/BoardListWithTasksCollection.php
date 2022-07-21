<?php

namespace App\Http\Resources\BoardLists;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class BoardListWithTasksCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request): array
    {
        return [
            'data' => $this->collection,
        ];
    }
}
