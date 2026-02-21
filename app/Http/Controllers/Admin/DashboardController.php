<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use App\Models\Article;
use App\Models\Employee;
use App\Models\Gallery;
use App\Models\User;
use Carbon\Carbon;
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

        $recentArticles = Article::query()
            ->latest()
            ->limit(3)
            ->get(['id', 'title', 'slug', 'created_at', 'is_published']);

        $recentUsers = User::query()
            ->latest()
            ->limit(3)
            ->get(['id', 'name', 'email', 'is_admin', 'created_at']);

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

        // monthly chart
        $months = collect(range(6, 0))->map(function (int $offset) {
            return now()->subMonths($offset)->format('Y-m');
        });

        $articlesByMonth = Article::query()
            ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count")
            ->where('created_at', '>=', now()->subMonths(6)->startOfMonth())
            ->groupBy('month')
            ->pluck('count', 'month');

        $usersByMonth = User::query()
            ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count")
            ->where('created_at', '>=', now()->subMonths(6)->startOfMonth())
            ->groupBy('month')
            ->pluck('count', 'month');

        $monthlyChart = $months->map(function (string $ym) use ($articlesByMonth, $usersByMonth) {
            $label = Carbon::createFromFormat('Y-m', $ym)->format('M');

            return [
                'month'    => $label,
                'articles' => (int) ($articlesByMonth[$ym] ?? 0),
                'users'    => (int) ($usersByMonth[$ym] ?? 0),
            ];
        })->values()->toArray();

        if (Auth::user()->is_admin) {
            return Inertia::render('admin/dashboard', [
                'articles' => [
                    'total'     => $articles->total,
                    'draft'     => $articles->draft,
                    'published' => $articles->published,
                    'recent' => $recentArticles,
                ],
                'achievements' => [
                    'total'       => $achievements->total,
                    'academic'    => $achievements->academic,
                    'non_academic' => $achievements->non_academic,
                ],
                'users' => [
                    'total' => $users->total,
                    'admin' => $users->admins,
                    'users' => $users->users,
                    'recent' => $recentUsers,
                ],
                'employees'    => $employees,
                'galleries'    => $galleries,
                'monthly_chart' => $monthlyChart,
            ]);
        } else {
            return Inertia::render('admin/dashboard', [
                'articles' => [
                    'total'     => $articles->total,
                    'draft'     => $articles->draft,
                    'published' => $articles->published,
                ],
                'galleries'    => $galleries,
                // Non-admins still get article-only chart (users column will be 0)
                'monthly_chart' => array_map(
                    fn($row) => ['month' => $row['month'], 'articles' => $row['articles'], 'users' => 0],
                    $monthlyChart
                ),
            ]);
        }
    }
}
