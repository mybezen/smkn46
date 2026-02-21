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

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        $extracurriculars = $query->latest()
            ->paginate(10);

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

    public function edit(string $id)
    {
        $extracurricular = Extracurricular::find($id);

        if (!$extracurricular) {
            return redirect()->back()->with('error', 'Extracurricular not found.');
        }

        return Inertia::render('admin/extracurriculars/edit', [
            'extracurricular' => $extracurricular,
        ]);
    }

    public function update(UpdateExtracurricularRequest $request, string $id)
    {
        $extracurricular = Extracurricular::find($id);

        if (!$extracurricular) {
            return redirect()->back()->with('error', 'Extracurricular not found.');
        }

        $data = $request->validated();

        if ($request->hasFile('thumbnail')) {
            if ($extracurricular->thumbnail && Storage::disk('public')->exists($extracurricular->thumbnail)) {
                Storage::disk('public')->delete($extracurricular->thumbnail);
            }

            $data['thumbnail'] = $request->file('thumbnail')->store('extracurricular/thumbnails', 'public');
        } else {
            unset($data['thumbnail']);
        }

        $extracurricular->update($data);

        return redirect()
            ->route('admin.extracurriculars.index')
            ->with('success', 'Extracurricular updated successfully.');
    }

    public function destroy(string $id)
    {
        $extracurricular = Extracurricular::find($id);

        if (!$extracurricular) {
            return redirect()->back()->with('error', 'Extracurricular not found.');
        }

        if ($extracurricular->thumbnail && Storage::disk('public')->exists($extracurricular->thumbnail)) {
            Storage::disk('public')->delete($extracurricular->thumbnail);
        }

        $extracurricular->delete();

        return redirect()
            ->route('admin.extracurriculars.index')
            ->with('success', 'Extracurricular deleted successfully.');
    }
}
