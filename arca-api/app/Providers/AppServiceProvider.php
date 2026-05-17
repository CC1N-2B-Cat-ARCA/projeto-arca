<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use App\Contracts\DatabaseInterface;

use App\Services\JsonDatabase;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
        $this->app->bind(DatabaseInterface::class, JsonDatabase::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
