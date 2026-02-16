<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAchievementRequest;
use App\Http\Requests\UpdateAchievementRequest;
use App\Models\Achievement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AchievementController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Achievement::query();

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        $achievements = $query->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn ($achievement) => [
                'id' => $achievement->id,
                'title' => $achievement->title,
                'description' => $achievement->description,
                'thumbnail' => $achievement->thumbnail ? Storage::disk('public')->url($achievement->thumbnail) : null,
                'category' => $achievement->category,
                'created_at' => $achievement->created_at->format('d M Y'),
            ]);

        return Inertia::render('admin/achievements/index', [
            'achievements' => $achievements,
            'filters' => [
                'search' => $request->search,
                'category' => $request->category,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/achievements/create');
    }

    public function store(StoreAchievementRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('thumbnail')) {
            $data['thumbnail'] = $request->file('thumbnail')->store('achievements', 'public');
        }

        Achievement::create($data);

        return redirect()->route('admin.achievements.index')
            ->with('success', 'Achievement created successfully.');
    }

    public function edit(Achievement $achievement): Response
    {
        return Inertia::render('admin/achievements/edit', [
            'achievement' => [
                'id' => $achievement->id,
                'title' => $achievement->title,
                'description' => $achievement->description,
                'thumbnail' => $achievement->thumbnail ? Storage::disk('public')->url($achievement->thumbnail) : null,
                'category' => $achievement->category,
            ],
        ]);
    }

    public function update(UpdateAchievementRequest $request, Achievement $achievement)
    {
        $data = $request->validated();

        if ($request->hasFile('thumbnail')) {
            if ($achievement->thumbnail) {
                Storage::disk('public')->delete($achievement->thumbnail);
            }
            $data['thumbnail'] = $request->file('thumbnail')->store('achievements', 'public');
        }

        $achievement->update($data);

        return redirect()->route('admin.achievements.index')
            ->with('success', 'Achievement updated successfully.');
    }

    public function destroy(Achievement $achievement)
    {
        if ($achievement->thumbnail) {
            Storage::disk('public')->delete($achievement->thumbnail);
        }

        $achievement->delete();

        return redirect()->route('admin.achievements.index')
            ->with('success', 'Achievement deleted successfully.');
    }
}