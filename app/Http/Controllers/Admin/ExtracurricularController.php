<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreExtracurricularRequest;
use App\Http\Requests\UpdateExtracurricularRequest;
use App\Models\Extracurricular;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ExtracurricularController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Extracurricular::query();

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $extracurriculars = $query->latest()
            ->paginate(10)
            ->through(fn($item) => [
                'id' => $item->id,
                'name' => $item->name,
                'description' => $item->description,
                'category' => $item->category,
                'thumbnail' => $item->thumbnail ? Storage::disk('public')->url($item->thumbnail) : null,
                'created_at' => $item->created_at->format('Y-m-d H:i:s'),
            ]);

        return Inertia::render('admin/extracurriculars/index', [
            'extracurriculars' => $extracurriculars,
            'filters' => [
                'category' => $request->category ?? 'all',
                'search' => $request->search ?? '',
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/extracurriculars/create');
    }

    public function store(StoreExtracurricularRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('thumbnail')) {
            $data['thumbnail'] = $request->file('thumbnail')->store('extracurricular/thumbnails', 'public');
        }

            Extracurricular::create($data);

        return redirect()
            ->route('admin.extracurriculars.index')
            ->with('success', 'Extracurricular created successfully.');
    }

    public function edit(Extracurricular $extracurricular): Response
    {
        return Inertia::render('admin/extracurriculars/edit', [
            'extracurricular' => [
                'id' => $extracurricular->id,
                'name' => $extracurricular->name,
                'description' => $extracurricular->description,
                'category' => $extracurricular->category,
                'thumbnail' => $extracurricular->thumbnail ? Storage::disk('public')->url($extracurricular->thumbnail) : null,
            ],
        ]);
    }

    public function update(UpdateExtracurricularRequest $request, Extracurricular $extracurricular)
    {
        $data = $request->validated();

        if ($request->hasFile('thumbnail')) {
            if ($extracurricular->thumbnail) {
                Storage::disk('public')->delete($extracurricular->thumbnail);
            }
            $data['thumbnail'] = $request->file('thumbnail')->store('extracurricular/thumbnails', 'public');
        }

        $extracurricular->update($data);

        return redirect()
            ->route('admin.extracurriculars.index')
            ->with('success', 'Extracurricular updated successfully.');
    }

    public function destroy(Extracurricular $extracurricular)
    {
        if ($extracurricular->thumbnail) {
            Storage::disk('public')->delete($extracurricular->thumbnail);
        }

        $extracurricular->delete();

        return redirect()
            ->route('admin.extracurriculars.index')
            ->with('success', 'Extracurricular deleted successfully.');
    }
}