<?php

namespace App\Exceptions;

class UserException extends CustomBaseException
{
    /**
     * @return UserException
     */
    public static function emailExists(): UserException
    {
        return new self('Email already exists', ['user' => trans('auth.email_already_exists')]);
    }

    /**
     * @return UserException
     */
    public static function invalidLogin(): UserException
    {
        return new self('Credentials are incorrect', ['user' => trans('auth.invalid_credentials')]);
    }

    /**
     * @return UserException
     */
    public static function userNotFound(): UserException
    {
        return new self('User Not Found', ['user' => trans('auth.user_not_found')]);
    }
}
