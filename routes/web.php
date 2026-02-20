<?php

use App\Http\Controllers\Admin\AchievementController;
use App\Http\Controllers\Admin\BannerController;
use App\Http\Controllers\Admin\ExtracurricularController;
use App\Http\Controllers\Admin\MajorController;
use App\Http\Controllers\Admin\ArticleController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\Admin\FacilityController;
use App\Http\Controllers\Admin\GalleryController;
use App\Http\Controllers\Admin\SchoolProfileController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\ArticleController as UserArticleController;
use App\Http\Controllers\FacilityController as UserFacilityController;
use App\Http\Controllers\GalleryController as UserGalleryController;
use App\Http\Controllers\EmployeeController as UserEmployeeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::prefix('admin')->name('admin.')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::middleware('admin')->group(function () {
        Route::name('achievements.')->group(function () {
            Route::get('/achievements', [AchievementController::class, 'index'])->name('index');
            Route::post('/achievements', [AchievementController::class, 'store'])->name('store');
            Route::get('/achievements/create', [AchievementController::class, 'create'])->name('create');
            Route::get('/achievements/{id}/edit', [AchievementController::class, 'edit'])->name('edit');
            Route::put('/achievements/{id}', [AchievementController::class, 'update'])->name('update');
            Route::delete('/achievements/{id}', [AchievementController::class, 'destroy'])->name('destroy');
        });

        Route::name('banners.')->group(function () {
            Route::get('/banners', [BannerController::class, 'index'])->name('index');
            Route::post('/banners', [BannerController::class, 'store'])->name('store');
            Route::get('/banners/create', [BannerController::class, 'create'])->name('create');
            Route::get('/banners/{id}/edit', [BannerController::class, 'edit'])->name('edit');
            Route::put('/banners/{id}', [BannerController::class, 'update'])->name('update');
            Route::delete('/banners/{id}', [BannerController::class, 'destroy'])->name('destroy');
        });

        Route::name('majors.')->group(function () {
            Route::get('/majors', [MajorController::class, 'index'])->name('index');
            Route::post('/majors', [MajorController::class, 'store'])->name('store');
            Route::get('/majors/create', [MajorController::class, 'create'])->name('create');
            Route::get('/majors/{id}/edit', [MajorController::class, 'edit'])->name('edit');
            Route::put('/majors/{id}', [MajorController::class, 'update'])->name('update');
            Route::delete('/majors/{id}', [MajorController::class, 'destroy'])->name('destroy');
        });

        Route::name('extracurriculars.')->group(function () {
            Route::get('/extracurriculars', [ExtracurricularController::class, 'index'])->name('index');
            Route::post('/extracurriculars', [ExtracurricularController::class, 'store'])->name('store');
            Route::get('/extracurriculars/create', [ExtracurricularController::class, 'create'])->name('create');
            Route::get('/extracurriculars/{id}/edit', [ExtracurricularController::class, 'edit'])->name('edit');
            Route::put('/extracurriculars/{id}', [ExtracurricularController::class, 'update'])->name('update');
            Route::delete('/extracurriculars/{id}', [ExtracurricularController::class, 'destroy'])->name('destroy');
        });

        Route::name('facilities.')->group(function () {
            Route::get('/facilities', [FacilityController::class, 'index'])->name('index');
            Route::post('/facilities', [FacilityController::class, 'store'])->name('store');
            Route::get('/facilities/create', [FacilityController::class, 'create'])->name('create');
            Route::get('/facilities/{slug}/edit', [FacilityController::class, 'edit'])->name('edit');
            Route::get('/facilities/{slug}', [FacilityController::class, 'show'])->name('show');
            Route::put('/facilities/{slug}', [FacilityController::class, 'update'])->name('update');
            Route::delete('/facilities/{slug}', [FacilityController::class, 'destroy'])->name('destroy');
        });

        Route::name('employees.')->group(function () {
            Route::get('/employees', [EmployeeController::class, 'index'])->name('index');
            Route::post('/employees', [EmployeeController::class, 'store'])->name('store');
            Route::get('/employees/create', [EmployeeController::class, 'create'])->name('create');
            Route::get('/employees/{id}/edit', [EmployeeController::class, 'edit'])->name('edit');
            Route::put('/employees/{id}', [EmployeeController::class, 'update'])->name('update');
            Route::delete('/employees/{id}', [EmployeeController::class, 'destroy'])->name('destroy');
        });

        Route::name('user.')->group(function () {
            Route::get('/users', [UserController::class, 'index'])->name('index');
            Route::get('/users/create', [UserController::class, 'create'])->name('create');
            Route::post('/users', [UserController::class, 'store'])->name('store');
            Route::get('/users/{id}/edit', [UserController::class, 'edit'])->name('edit');
            Route::put('/users/{id}', [UserController::class, 'update'])->name('update');
            Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('destroy');
        });

        Route::get('/profile/headmaster', [SchoolProfileController::class, 'getHeadmaster'])->name('get-headmaster');
        Route::put('/profile/headmaster', [SchoolProfileController::class, 'updateHeadmaster'])->name('update-headmaster');
        Route::get('/profile/profile', [SchoolProfileController::class, 'getProfile'])->name('get-profile');
        Route::put('/profile/profile', [SchoolProfileController::class, 'updateProfile'])->name('update-profile');
        Route::get('/profile/history', [SchoolProfileController::class, 'getHistory'])->name('get-history');
        Route::put('/profile/history', [SchoolProfileController::class, 'updateHistory'])->name('update-history');
        Route::get('/profile/vision-mission', [SchoolProfileController::class, 'getVisionMission'])->name('get-vision-mission');
        Route::put('/profile/vision-mission', [SchoolProfileController::class, 'updateVisionMission'])->name('update-vision-mission');
        Route::get('/profile/organization-structure', [SchoolProfileController::class, 'getOrganizationStructure'])->name('get-structure');
        Route::put('/profile/organization-structure', [SchoolProfileController::class, 'updateOrganizationStructure'])->name('update-structure');
    });

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
        Route::get('/articles/{slug}', [ArticleController::class, 'show'])->name('show');
        Route::put('/articles/{slug}', [ArticleController::class, 'update'])->name('update');
        Route::delete('/articles/{slug}', [ArticleController::class, 'destroy'])->name('destroy');
    });

    Route::name('galleries.')->group(function () {
        Route::get('/galleries', [GalleryController::class, 'index'])->name('index');
        Route::post('/galleries', [GalleryController::class, 'store'])->name('store');
        Route::get('/galleries/create', [GalleryController::class, 'create'])->name('create');
        Route::delete('/galleries/image/{id}/delete', [GalleryController::class, 'deleteImage'])->name('delete-image');
        Route::get('/galleries/{slug}/edit', [GalleryController::class, 'edit'])->name('edit');
        Route::get('/galleries/{slug}', [GalleryController::class, 'show'])->name('show');
        Route::put('/galleries/{slug}', [GalleryController::class, 'update'])->name('update');
        Route::delete('/galleries/{slug}', [GalleryController::class, 'destroy'])->name('destroy');
    });
});

Route::prefix('articles')->name('articles.')->group(function () {
    Route::get('/articles', [UserArticleController::class, 'index'])->name('index');
    Route::get('/articles/{slug}', [UserArticleController::class, 'show'])->name('show');
});

Route::name('galleries.')->group(function () {
    Route::get('/galleries', [UserGalleryController::class, 'index'])->name('index');
    Route::get('/galleries/{slug}', [UserGalleryController::class, 'show'])->name('show');
});

Route::name('facilities.')->group(function () {
    Route::get('/facilities', [UserFacilityController::class, 'index'])->name('index');
    Route::get('/facilities/{slug}', [UserFacilityController::class, 'show'])->name('show');
});

Route::get('/guru-karyawan', [UserEmployeeController::class, 'index'])->name('index');

require __DIR__ . '/settings.php';
