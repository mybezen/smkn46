<?php

namespace App\Http\Controllers;

use App\Models\Extracurricular;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExtracurricularController extends Controller
{
    public function index(Request $request)
    {
        $extracurriculars = Extracurricular::query();
        
        if ($request->has('category') && $request->category !== 'all') {
            $extracurriculars->where('category', $request->category);
        }
        
        $extracurriculars->latest()->get();
        
        return Inertia::render('#', [
            'extracurriculars' => $extracurriculars,
        ]);
    }
}
