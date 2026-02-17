<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Gallery\StoreGalleryRequest;
use App\Http\Requests\Gallery\UpdateGalleryRequest;
use App\Models\Gallery;
use App\Models\GalleryImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class GalleryController extends Controller
{
    public function index(Request $request)
    {
        $galleries = Gallery::query()
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where('title', 'like', '%' . $request->search . '%');
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/galleries/index', [
            'galleries' => $galleries,
            'filters'   => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/galleries/create');
    }

    public function store(StoreGalleryRequest $request)
    {
        $validated = $request->validated();

        $baseSlug = Str::slug($validated['title']);
        $newSlug  = $baseSlug;
        $counter  = 1;

        while (Gallery::where('slug', $newSlug)->exists()) {
            $newSlug = $baseSlug . '-' . $counter;
            $counter++;
        }

        DB::beginTransaction();

        try {
            $gallery = Gallery::create([
                'title'       => $validated['title'],
                'slug'        => $newSlug,
                'description' => $validated['description'] ?? null,
            ]);

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $file) {
                    $path = Storage::disk('public')->putFile('galleries', $file);

                    $gallery->images()->create(['image' => $path]);
                }
            }

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();

            return redirect()->back()->with('error', $th->getMessage());
        }

        return redirect('/admin/galleries')->with('success', 'Gallery created successfully.');
    }

    public function show(string $slug)
    {
        $gallery = Gallery::with('images')->where('slug', $slug)->first();

        if (!$gallery) {
            return redirect('/admin/galleries')->with('error', 'Gallery not found.');
        }

        return Inertia::render('admin/galleries/show', [
            'gallery' => $gallery,
        ]);
    }

    public function edit(string $slug)
    {
        $gallery = Gallery::with('images')->where('slug', $slug)->first();

        if (!$gallery) {
            return redirect()->back()->with('error', 'Gallery not found.');
        }

        return Inertia::render('admin/galleries/edit', [
            'gallery' => $gallery,
        ]);
    }

    public function update(UpdateGalleryRequest $request, string $slug)
    {
        $gallery = Gallery::where('slug', $slug)->first();

        if (!$gallery) {
            return redirect()->back()->with('error', 'Gallery not found.');
        }

        $validated = $request->validated();

        if ($validated['title'] !== $gallery->title) {
            $baseSlug = Str::slug($validated['title']);
            $newSlug  = $baseSlug;
            $counter  = 1;

            while (
                Gallery::where('slug', $newSlug)
                    ->where('id', '!=', $gallery->id)
                    ->exists()
            ) {
                $newSlug = $baseSlug . '-' . $counter;
                $counter++;
            }

            $gallery->slug = $newSlug;
        }

        DB::beginTransaction();

        try {
            $gallery->update([
                'title'       => $validated['title'],
                'description' => $validated['description'] ?? null,
                'slug'        => $gallery->slug,
            ]);

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $file) {
                    $path = Storage::disk('public')->putFile('galleries', $file);

                    $gallery->images()->create(['image' => $path]);
                }
            }

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();

            return redirect()->back()->with('error', $th->getMessage());
        }

        return redirect('/admin/galleries')->with('success', 'Gallery updated successfully.');
    }

    public function destroy(string $slug)
    {
        $gallery = Gallery::with('images')->where('slug', $slug)->first();

        if (!$gallery) {
            return redirect()->back()->with('error', 'Gallery not found.');
        }

        DB::beginTransaction();

        try {
            foreach ($gallery->images as $image) {
                if (Storage::disk('public')->exists($image->image)) {
                    Storage::disk('public')->delete($image->image);
                }

                $image->delete();
            }

            $gallery->delete();

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();

            return redirect()->back()->with('error', $th->getMessage());
        }

        return redirect('/admin/galleries')->with('success', 'Gallery deleted successfully.');
    }

    public function deleteImage(int $id)
    {
        $image = GalleryImage::find($id);

        if (!$image) {
            return redirect()->back()->with('error', 'Image not found.');
        }

        try {
            if (Storage::disk('public')->exists($image->image)) {
                Storage::disk('public')->delete($image->image);
            }

            $image->delete();
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', $th->getMessage());
        }

        return redirect()->back()->with('success', 'Image deleted successfully.');
    }
}