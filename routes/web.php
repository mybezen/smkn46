<?php

use App\Http\Controllers\Admin\AchievementController;
use App\Http\Controllers\Admin\BannerController;
use App\Http\Controllers\Admin\ExtracurricularController;
use App\Http\Controllers\Admin\MajorController;
use App\Http\Controllers\Admin\ArticleController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\GalleryController;
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

Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'verified'])
    ->group(function () {

        Route::resource('achievements', AchievementController::class);

        Route::resource('banners', BannerController::class);

        Route::resource('majors', MajorController::class);

        Route::resource('extracurriculars', ExtracurricularController::class);

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
    });



Route::get('/dashboard', function () {
    return Inertia::render('admin/dashboard');
})->name('dashboard');


Route::prefix('articles')->name('articles.')->group(function () {
    Route::get('/articles', [UserArticleController::class, 'index'])->name('index');
    Route::get('/articles/{slug}', [UserArticleController::class, 'show'])->name('show');
});

Route::prefix('galleries')->name('galleries.')->group(function () {
    Route::get('/galleries', [UserGalleryController::class, 'index'])->name('index');
    Route::get('/galleries/{slug}', [UserGalleryController::class, 'show'])->name('show');
});


Route::middleware('auth')->group(function () {});

require __DIR__ . '/settings.php';
