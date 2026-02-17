<?php

namespace App\Http\Controllers;

use App\Models\Facility;
use Illuminate\Http\Request;

class FacilityController extends Controller
{
    public function index()
    {
        $facilities = Facility::all();

        // return $facility;
    }

    public function show(string $slug)
    {
        $facility = Facility::where('slug', $slug)->first();

        if (!$facility) {
            return redirect()->back()->with('error', 'Facility not found.');
        }
        
        // return $facility;
    }
}
