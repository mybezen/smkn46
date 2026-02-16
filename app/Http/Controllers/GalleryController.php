<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function index(Request $request)
    {
        $galleries = Gallery::with('images')
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->search;

                $query->where('title', 'like', '%' . $search . '%');
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

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
