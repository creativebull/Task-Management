<?php


namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Arr;

class CustomBaseException extends Exception
{
    /**
     * @var array
     */
    public array $errorBag = [];

    /**
     * The status code to use for the response.
     *
     * @var int
     */
    public int $status = 422;

    public function __construct($message = "", $errors = [], $status = 422)
    {
        parent::__construct($message);

        $this->errorBag = $errors;
        $this->status = $status;
    }

    /**
     * Report or log an exception.
     *
     * @return void
     */
    public function report(): void
    {
        // Log::debug('Permission denied');
    }

    /**
     * @return JsonResponse
     */
    public function render(): JsonResponse
    {
        // Make the error message match the validation exception messages
        $errorMessages = [];
        foreach ($this->errorBag as $k => $v) {
            $errorMessages[$k] = Arr::wrap($v);
        }

        return response()->json([
            'message' => $this->message,
            'errors' => $errorMessages,
        ], $this->status);
    }
}
