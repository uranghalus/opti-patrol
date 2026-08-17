<?php

namespace App\Providers;

use App\Facades\Image;
use App\Support\GdImageManager;
use Illuminate\Support\ServiceProvider;

class ImageServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton('gd-image', function () {
            return new GdImageManager;
        });

        // Keep existing controller imports working without edits:
        // they reference Intervention\Image\Laravel\Facades\Image
        if (! class_exists('Intervention\Image\Laravel\Facades\Image')) {
            class_alias(Image::class, 'Intervention\Image\Laravel\Facades\Image');
        }
    }
}
