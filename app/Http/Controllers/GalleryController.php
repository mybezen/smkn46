<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function index()
    {
        $galleries = Gallery::with('images')->get();

        // return $galleries;
    }

    public function show(string $slug)
    {
        $gallery = Gallery::with('images')
            ->where('slug', $slug)->first();

        if (!$gallery) {
            return redirect()->back()->with('error', 'Gallery not found.');
        }

        // return $gallery;
    }
}
