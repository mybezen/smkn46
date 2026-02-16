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
            ->paginate(10)
            ->through(fn($item) => [
                'id' => $item->id,
                'name' => $item->name,
                'slug' => $item->slug,
                'description' => $item->description,
                'icon' => $item->icon ? Storage::disk('public')->url($item->icon) : null,
                'preview_image' => $item->preview_image ? Storage::disk('public')->url($item->preview_image) : null,
                'created_at' => $item->created_at->format('Y-m-d H:i:s'),
            ]);

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

    public function edit(Major $major): Response
    {
        return Inertia::render('admin/majors/edit', [
            'major' => [
                'id' => $major->id,
                'name' => $major->name,
                'slug' => $major->slug,
                'description' => $major->description,
                'icon' => $major->icon ? Storage::disk('public')->url($major->icon) : null,
                'preview_image' => $major->preview_image ? Storage::disk('public')->url($major->preview_image) : null,
            ],
        ]);
    }

    public function update(UpdateMajorRequest $request, Major $major)
    {
        $data = $request->validated();

        if ($request->hasFile('icon')) {
            if ($major->icon) {
                Storage::disk('public')->delete($major->icon);
            }
            $data['icon'] = $request->file('icon')->store('major/icons', 'public');
        }

        if ($request->hasFile('preview_image')) {
            if ($major->preview_image) {
                Storage::disk('public')->delete($major->preview_image);
            }
            $data['preview_image'] = $request->file('preview_image')->store('major/previews', 'public');
        }

        $major->update($data);

        return redirect()
            ->route('admin.majors.index')
            ->with('success', 'Major updated successfully.');
    }

    public function destroy(Major $major)
    {
        if ($major->icon) {
            Storage::disk('public')->delete($major->icon);
        }

        if ($major->preview_image) {
            Storage::disk('public')->delete($major->preview_image);
        }

        $major->delete();

        return redirect()
            ->route('majors.index')
            ->with('success', 'Major deleted successfully.');
    }
}