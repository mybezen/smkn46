<?php

use App\Http\Controllers\Admin\AchievementController;
use App\Http\Controllers\Admin\BannerController;
use App\Http\Controllers\Admin\ExtracurricularController;
use App\Http\Controllers\Admin\MajorController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'verified'])
    ->group(function () {

        Route::resource('achievements', AchievementController::class);

        Route::resource('banners', BannerController::class);

        Route::resource('majors', MajorController::class);

        Route::resource('extracurriculars', ExtracurricularController::class);


        Route::get('/dashboard', function () {
            return Inertia::render('admin/dashboard');
        })->name('dashboard');
    });

Route::get('/login', function () {
    return Inertia::render('auth/login');
})->name('login');

Route::get('/register', function () {
    return Inertia::render('auth/register');
})->name('register');

require __DIR__ . '/settings.php';
