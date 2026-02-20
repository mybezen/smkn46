<?php

namespace App\Http\Controllers;

use App\Models\Major;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MajorController extends Controller
{
    public function index()
    {
        $majors = Major::all();

        return Inertia::render('#', [
            'majors' => $majors,
        ]);
    }

    public function show(string $slug)
    {
        $major = Major::where('slug', $slug)->first();

        if (!$major) {
            return redirect()->back()->with('error', 'Major Not Found.');
        }

        return Inertia::render('#', [
            'major' => $major,
        ]);
    }
}
