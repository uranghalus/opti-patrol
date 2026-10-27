<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use OneLogin\Saml2\Auth as SamlAuth;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(SamlAuth::class, function ($app) {
            return new SamlAuth([
                'strict' => config('saml.strict', false),
                'debug' => config('saml.debug', false),
                'baseurl' => config('app.url'),
                'sp' => config('saml.sp', []),
                'idp' => config('saml.idp', []),
                'security' => config('saml.security', []),
            ]);
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();

        // Implicitly grant the "superadmin" role all permissions.
        // Follows Spatie v8 "Defining a Super-Admin": https://spatie.be/docs/laravel-permission/v8/basic-usage/super-admin
        // Must return null (not false) so normal policies still run when this does not apply.
        Gate::before(function ($user, $ability) {
            return $user->hasRole('superadmin') ? true : null;
        });
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(
            fn (): ?Password => app()->isProduction()
                ? Password::min(12)
                    ->mixedCase()
                    ->letters()
                    ->numbers()
                    ->symbols()
                    ->uncompromised()
                : null,
        );
    }
}
