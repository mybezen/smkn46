<?php

namespace App\Http\Controllers;

use App\Http\Requests\GalleryRequest;
use App\Models\Gallery;
use App\Models\GalleryImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class GalleryController extends Controller
{
    public function index()
    {
        $galleries = Gallery::with('images')->get();

        // return ;
    }

    public function table()
    {
        $galleries = Gallery::all();

        // return ;
    }

    public function show(string $slug)
    {
        $gallery = Gallery::with('images')
            ->where('slug', $slug)->first();

        if (!$gallery) {
            return redirect()->back()->with('error', 'Gallery not found.');
        }

        // return ;
    }

    public function create()
    {
        // return ;
    }

    public function store(GalleryRequest $request)
    {
        $baseSlug = Str::slug($request->title);
        $slug = $baseSlug;
        $counter = 1;

        while (
            Gallery::where('slug', $slug)->exists()
        ) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        $gallery = Gallery::create([
            'title' => $request->title,
            'slug' => $slug,
            'description' => $request->description,
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = Storage::disk('public')->putFile('galleries', $image);

                $gallery->images()->create([
                    'image' => $path,
                ]);
            }
        }

        return redirect()->back()->with('success', 'Gallery created successfully.');
    }

    public function edit(string $slug)
    {
        $gallery = Gallery::with('images')
            ->where('slug', $slug)->first();

        if (!$gallery) {
            return redirect()->back()->with('error', 'Gallery not found.');
        }

        // return ;
    }

    public function update(GalleryRequest $request, string $slug)
    {
        $gallery = Gallery::where('slug', $slug)->first();

        if (!$gallery) {
            return redirect()->back()->with('error', 'Gallery not found.');
        }

        if ($request->title !== $gallery->title) {
            $baseSlug = Str::slug($request->title);
            $newSlug = $baseSlug;
            $counter = 1;

            while (Gallery::where('slug', $newSlug)->where('id', '!=', $gallery->id)->exists()) {
                $newSlug = $baseSlug . '-' . $counter;
                $counter++;
            }

            $gallery->slug = $newSlug;
        }

        $gallery->title = $request->title;
        $gallery->description = $request->description;
        $gallery->save();

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = Storage::disk('public')->putFile('galleries', $image);

                $gallery->images()->create([
                    'image' => $path,
                ]);
            }
        }

        return redirect()->back()->with('success', 'Gallery updated successfully.');
    }

    public function destroy(string $slug)
    {
        $gallery = Gallery::where('slug', $slug)
            ->where('slug', $slug)->first();

        if (!$gallery) {
            return redirect()->back()->with('error', 'Gallery not found.');
        }

        foreach ($gallery->images as $image) {
            if (Storage::disk('public')->exists($image->image)) {
                Storage::disk('public')->delete($image->image);
            }
        }

        $gallery->delete();

        return redirect()->back()->with('success', 'Gallery deleted successfully.');
    }

    public function deleteImage(int $id)
    {
        $image = GalleryImage::find($id);

        if (!$image) {
            return redirect()->back()->with('error', 'Image not found.');
        }

        if (Storage::disk('public')->exists($image->image)) {
            Storage::disk('public')->delete($image->image);
        }

        $image->delete();

        return redirect()->back()->with('success', 'Image deleted successfully.');
    }
}
