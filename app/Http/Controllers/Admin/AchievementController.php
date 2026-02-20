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
            ->withQueryString();

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

    public function edit(string $id)
    {
        $achievement = Achievement::find($id);

        if (!$achievement) {
            return redirect()->back()->with('error', 'Achievement not found.');
        }

        return Inertia::render('admin/achievements/edit', [
            'achievement' => $achievement,
        ]);
    }

    public function update(UpdateAchievementRequest $request, string $id)
    {
        $achievement = Achievement::find($id);

        if (!$achievement) {
            return redirect()->back()->with('error', 'Achievement not found.');
        }

        $data = $request->validated();

        if ($request->hasFile('thumbnail')) {
            if ($achievement->thumbnail && Storage::disk('public')->exists($achievement->thumbnail)) {
                Storage::disk('public')->delete($achievement->thumbnail);
            }

            $data['thumbnail'] = $request->file('thumbnail')->store('achievements', 'public');
        } else {
            unset($data['thumbnail']);
        }

        $achievement->update($data);

        return redirect()->route('admin.achievements.index')
            ->with('success', 'Achievement updated successfully.');
    }

    public function destroy(string $id)
    {
        $achievement = Achievement::find($id);

        if (!$achievement) {
            return redirect()->back()->with('error', 'Achievement not found.');
        }

        if ($achievement->thumbnail && Storage::disk('public')->exists($achievement->thumbnail)) {
            Storage::disk('public')->delete($achievement->thumbnail);
        }

        $achievement->delete();

        return redirect()->route('admin.achievements.index')
            ->with('success', 'Achievement deleted successfully.');
    }
}
