<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * Facade for the GD-based image manager.
 * Resolves to the 'gd-image' container binding.
 */
class Image extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return 'gd-image';
    }
}
