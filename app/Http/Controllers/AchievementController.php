<?php

namespace App\Http\Controllers;

use App\Models\Achievement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AchievementController extends Controller
{
    public function index()
    {
        $achievements = Achievement::all();

        return Inertia::render('#', [
            'achievements' => $achievements,
        ]);
    }

    public function getAcademic()
    {
        $academicAchievements = Achievement::where('category', 'akademik')->get();

        return Inertia::render('#', [
            'achievements' => $academicAchievements,
        ]);
    }

    public function getNonAcademic()
    {
        $nonAcademicAchievements = Achievement::where('category', 'non-akademik')->get();

        return Inertia::render('#', [
            'achievements' => $nonAcademicAchievements,
        ]);
    }
}
