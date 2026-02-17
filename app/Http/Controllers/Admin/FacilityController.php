<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Facility\StoreFacilityRequest;
use App\Http\Requests\Facility\UpdateFacilityRequest;
use App\Models\Facility;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FacilityController extends Controller
{
    public function index(Request $request)
    {
        $facilities = Facility::query()
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->search;

                $query->where('name', 'like', '%' . $search . '%');
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        // return $facilities;
    }

    public function show(string $slug)
    {
        $facility = Facility::where('slug', $slug)->first();

        if (!$facility) {
            return redirect()->back()->with('error', 'Facility not found.');
        }

        // return $facility;
    }

    public function create()
    {
        // return ;
    }

    public function store(StoreFacilityRequest $request)
    {
        $validated = $request->validated();

        $baseSlug = Str::slug($validated['name']);
        $newSlug  = $baseSlug;
        $counter  = 1;

        while (Facility::where('slug', $newSlug)->exists()) {
            $newSlug = $baseSlug . '-' . $counter;
            $counter++;
        }

        $validated['slug'] = $newSlug;

        if ($request->hasFile('image')) {
            $file = $request->file('image');

            $validated['image'] = Storage::disk('public')->putFile('facilities', $file);
        }

        Facility::create($validated);

        return redirect()->route('admin.facilities.index')->with('success', 'Facility created successfully.');
    }

    public function edit(string $slug)
    {
        $facility = Facility::where('slug', $slug)->first();

        if (!$facility) {
            return redirect()->back()->with('error', 'Facility not found.');
        }

        // return ;
    }

    public function update(UpdateFacilityRequest $request, string $slug)
    {
        $facility = Facility::where('slug', $slug)->first();

        if (!$facility) {
            return redirect()->back()->with('error', 'Facility not found.');
        }

        $validated = $request->validated();

        if ($validated['name'] !== $facility->name) {
            $baseSlug = Str::slug($validated['name']);
            $newSlug  = $baseSlug;
            $counter  = 1;

            while (
                Facility::where('slug', $newSlug)
                ->where('id', '!=', $facility->id)
                ->exists()
            ) {
                $newSlug = $baseSlug . '-' . $counter;
                $counter++;
            }

            $validated['slug'] = $newSlug;

            if ($request->hasFile('image')) {
                if ($facility->image && Storage::disk('public')->exists($facility->image)) {
                    Storage::disk('public')->delete($facility->image);
                }

                $file = $request->file('image');

                $validated['image'] = Storage::disk('public')->putFile('facilities', $file);
            } else {
                unset($validated['image']);
            }

            $facility->update($validated);

            return redirect()->route('admin.facilities.index')->with('success', 'Facility updated successfully.');
        }
    }

    public function destroy(string $slug)
    {
        $facility = Facility::where('slug', $slug)->first();

        if (!$facility) {
            return redirect()->back()->with('error', 'Facility not found.');
        }

        if ($facility->image && Storage::disk('public')->exists($facility->image)) {
            Storage::disk('public')->delete($facility->image);
        }

        $facility->delete();

        return redirect()->route('admin.facilities.index')->with('success', 'Facility deleted successfully.');
    }
}
