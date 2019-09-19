<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

use Laravel\Passport\Passport;
use Illuminate\Support\Facades\Gate;
class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'App\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        //definr Acl==Access control list
        Gate::define('isAdmin',function($user){
            return $user->type == 'admin';
        });

        Gate::define('isUser',function($user){
            return $user->type == 'user';
        });

        Gate::define('isAuthor',function($user){
            return $user->type == 'author';
        });
        //
        Passport::routes();
    }
}
