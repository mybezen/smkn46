<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMajorRequest;
use App\Http\Requests\UpdateMajorRequest;
use App\Models\Major;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MajorController extends Controller
{
    public function index(): Response
    {
        $majors = Major::latest()
            ->paginate(10);

        return Inertia::render('admin/majors/index', [
            'majors' => $majors,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/majors/create');
    }

    public function store(StoreMajorRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('icon')) {
            $data['icon'] = $request->file('icon')->store('major/icons', 'public');
        }

        if ($request->hasFile('preview_image')) {
            $data['preview_image'] = $request->file('preview_image')->store('major/previews', 'public');
        }

        Major::create($data);

        return redirect()
            ->route('admin.majors.index')
            ->with('success', 'Major created successfully.');
    }

    public function edit(string $slug)
    {
        $major = Major::where('slug', $slug)->first();

        if (!$major) {
            return redirect()->back()->with('error', 'Major not found.');
        }

        return Inertia::render('admin/majors/edit', [
            'major' => $major,
        ]);
    }

    public function update(UpdateMajorRequest $request, string $slug)
    {
        $major = Major::where('slug', $slug)->first();

        if (!$major) {
            return redirect()->back()->with('error', 'Major not found.');
        }

        $data = $request->validated();

        if ($request->hasFile('icon')) {
            if ($major->icon && Storage::disk('public')->exists($major->icon)) {
                Storage::disk('public')->delete($major->icon);
            }

            $data['icon'] = $request->file('icon')->store('major/icons', 'public');
        } else {
            unset($data['icon']);
        }

        if ($request->hasFile('preview_image')) {
            if ($major->preview_image && Storage::disk('public')->exists($major->preview_image)) {
                Storage::disk('public')->delete($major->preview_image);
            }

            $data['preview_image'] = $request->file('preview_image')->store('major/previews', 'public');
        } else {
            unset($data['preview_image']);
        }

        $major->update($data);

        return redirect()
            ->route('admin.majors.index')
            ->with('success', 'Major updated successfully.');
    }

    public function destroy(string $slug)
    {
        $major = Major::where('slug', $slug)->first();

        if (!$major) {
            return redirect()->back()->with('error', 'Major not found.');
        }

        if ($major->icon && Storage::disk('public')->exists($major->icon)) {
            Storage::disk('public')->delete($major->icon);
        }

        if ($major->preview_image && Storage::disk('public')->exists($major->preview_image)) {
            Storage::disk('public')->delete($major->preview_image);
        }

        $major->delete();

        return redirect()
            ->route('admin.majors.index')
            ->with('success', 'Major deleted successfully.');
    }
}
