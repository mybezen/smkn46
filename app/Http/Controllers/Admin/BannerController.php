<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBannerRequest;
use App\Http\Requests\UpdateBannerRequest;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BannerController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Banner::query();

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $banners = $query->orderBy('order')
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn ($banner) => [
                'id' => $banner->id,
                'title' => $banner->title,
                'description' => $banner->description,
                'image' => Storage::disk('public')->url($banner->image),
                'link' => $banner->link,
                'is_active' => $banner->is_active,
                'order' => $banner->order,
                'created_at' => $banner->created_at->format('d M Y'),
            ]);

        return Inertia::render('admin/banners/index', [
            'banners' => $banners,
            'filters' => [
                'search' => $request->search,
                'is_active' => $request->is_active,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/banners/create');
    }

    public function store(StoreBannerRequest $request)
    {
        $data = $request->validated();
        $data['image'] = $request->file('image')->store('banners', 'public');

        Banner::create($data);

        return redirect()->route('admin.banners.index')
            ->with('success', 'Banner created successfully.');
    }

    public function edit(Banner $banner): Response
    {
        return Inertia::render('admin/banners/edit', [
            'banner' => [
                'id' => $banner->id,
                'title' => $banner->title,
                'description' => $banner->description,
                'image' => Storage::disk('public')->url($banner->image),
                'link' => $banner->link,
                'is_active' => $banner->is_active,
                'order' => $banner->order,
            ],
        ]);
    }

    public function update(UpdateBannerRequest $request, Banner $banner)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            Storage::disk('public')->delete($banner->image);
            $data['image'] = $request->file('image')->store('banners', 'public');
        }

        $banner->update($data);

        return redirect()->route('admin.banners.index')
            ->with('success', 'Banner updated successfully.');
    }

    public function destroy(Banner $banner)
    {
        Storage::disk('public')->delete($banner->image);
        $banner->delete();

        return redirect()->route('admin.banners.index')
            ->with('success', 'Banner deleted successfully.');
    }
}