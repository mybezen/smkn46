<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Banner;
use App\Models\Major;
use App\Models\SchoolProfile;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LandingController extends Controller
{
    public function index()
    {
        $banners = Banner::where('is_active', true)->get();
        $majors = Major::all();
        $articles = Article::where('is_published', true)->latest()->take(2)->get();
        $setting = Setting::first();
        $headmaster = SchoolProfile::where('type', 'HEADMASTER')
            ->select('title', 'content', 'main_image')->first();

        return Inertia::render('welcome', [
            'banners' => $banners,
            'headmaster' => $headmaster,
            'majors' => $majors,
            'articles' => $articles,
            'setting' => $setting,
        ]);
    }
}
