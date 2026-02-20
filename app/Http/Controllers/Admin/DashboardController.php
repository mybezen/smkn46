<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use App\Models\Article;
use App\Models\Employee;
use App\Models\Gallery;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $articles = Article::query()
            ->selectRaw('
                COUNT(*) as total,
                COALESCE(SUM(is_published = 0), 0) as draft,
                COALESCE(SUM(is_published = 1), 0) as published
            ')
            ->first();

        $achievements = Achievement::query()
            ->selectRaw("
                COUNT(*) as total,
                COALESCE(SUM(category = 'akademik'), 0) as academic,
                COALESCE(SUM(category = 'non_akademik'), 0) as non_academic
            ")
            ->first();

        $users = User::query()
            ->selectRaw('
                COUNT(*) as total,
                COALESCE(SUM(is_admin = 0), 0) as users,
                COALESCE(SUM(is_admin = 1), 0) as admins
            ')
            ->first();

        $employees = Employee::count();
        $galleries = Gallery::count();

        if (Auth::user()->is_admin) {
            return Inertia::render('admin/dashboard', [
                'articles' => [
                    'total' => $articles->total,
                    'draft' => $articles->draft,
                    'published' => $articles->published,
                ],
                'achievements' => [
                    'total' => $achievements->total,
                    'academic' => $achievements->academic,
                    'non_academic' => $achievements->non_academic,
                ],
                'users' => [
                    'total' => $users->total,
                    'admin' => $users->admins,
                    'users' => $users->users,
                ],
                'employees' => $employees,
                'galleries' => $galleries,
            ]);
        } else {
            return Inertia::render('admin/dashboard', [
                'articles' => [
                    'total' => $articles->total,
                    'draft' => $articles->draft,
                    'published' => $articles->published,
                ],
                'galleries' => $galleries,
            ]);
        }
    }
}
