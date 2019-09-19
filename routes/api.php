<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});


Route::apiResource('user','Api\UsersCtrl');
Route::get('profile','Api\UsersCtrl@show');
Route::put('profile','Api\UsersCtrl@updateInfo');
Route::get('findUser', 'API\UsersCtrl@search');
