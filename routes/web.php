<?php

use App\Http\Controllers\Admin\ArticleController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\GalleryController;
use App\Http\Controllers\Admin\SchoolProfileController;
use App\Http\Controllers\ArticleController as UserArticleController;
use App\Http\Controllers\GalleryController as UserGalleryController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'verified'])
    ->group(function () {
        Route::name('categories.')->group(function () {
            Route::get('/categories', [CategoryController::class, 'index'])->name('index');
            Route::post('/categories', [CategoryController::class, 'store'])->name('store');
            Route::get('/categories/create', [CategoryController::class, 'create'])->name('create');
            Route::get('/categories/{slug}/edit', [CategoryController::class, 'edit'])->name('edit');
            Route::put('/categories/{slug}', [CategoryController::class, 'update'])->name('update');
            Route::delete('/categories/{slug}', [CategoryController::class, 'destroy'])->name('destroy');
        });

        Route::name('articles.')->group(function () {
            Route::get('/articles', [ArticleController::class, 'index'])->name('index');
            Route::post('/articles', [ArticleController::class, 'store'])->name('store');
            Route::get('/articles/create', [ArticleController::class, 'create'])->name('create');
            Route::get('/articles/{slug}/edit', [ArticleController::class, 'edit'])->name('edit');
            Route::put('/articles/{slug}/status', [ArticleController::class, 'updateStatus'])->name('update-status');
            Route::put('/articles/{slug}', [ArticleController::class, 'update'])->name('update');
            Route::delete('/articles/{slug}', [ArticleController::class, 'destroy'])->name('destroy');
        });

        Route::name('galleries.')->group(function () {
            Route::get('/galleries', [GalleryController::class, 'index'])->name('index');
            Route::post('/galleries', [GalleryController::class, 'store'])->name('store');
            Route::get('/galleries/create', [GalleryController::class, 'create'])->name('create');
            Route::delete('/galleries/image/{id}/delete', [GalleryController::class, 'deleteImage'])->name('delete-image');
            Route::get('/galleries/{slug}/edit', [GalleryController::class, 'edit'])->name('edit');
            Route::put('/galleries/{slug}', [GalleryController::class, 'update'])->name('update');
            Route::delete('/galleries/{slug}', [GalleryController::class, 'destroy'])->name('destroy');
        });

        Route::get('/school-profile/headmaster', [SchoolProfileController::class, 'getHeadmaster'])->name('get-headmaster');
        Route::put('/school-profile/headmaster', [SchoolProfileController::class, 'updateHeadmaster'])->name('update-headmaster');
        Route::get('/school-profile/profile', [SchoolProfileController::class, 'getProfile'])->name('get-profile');
        Route::put('/school-profile/profile', [SchoolProfileController::class, 'updateProfile'])->name('update-profile');
        Route::get('/school-profile/history', [SchoolProfileController::class, 'getHistory'])->name('get-history');
        Route::put('/school-profile/history', [SchoolProfileController::class, 'updateHistory'])->name('update-history');
        Route::get('/school-profile/vision-mission', [SchoolProfileController::class, 'getVisionMission'])->name('get-vision-mission');
        Route::put('/school-profile/vision-mission', [SchoolProfileController::class, 'updateVisionMission'])->name('update-vision-mission');
        Route::get('/school-profile/organization-structure', [SchoolProfileController::class, 'getOrganizationStructure'])->name('get-structure');
        Route::put('/school-profile/organization-structure', [SchoolProfileController::class, 'updateOrganizationStructure'])->name('update-structure');
    });

Route::prefix('articles')->name('articles.')->group(function () {
    Route::get('/articles', [UserArticleController::class, 'index'])->name('index');
    Route::get('/articles/{slug}', [UserArticleController::class, 'show'])->name('show');
});

Route::prefix('galleries')->name('galleries.')->group(function () {
    Route::get('/galleries', [UserGalleryController::class, 'index'])->name('index');
    Route::get('/galleries/{slug}', [UserGalleryController::class, 'show'])->name('show');
});

require __DIR__ . '/settings.php';
