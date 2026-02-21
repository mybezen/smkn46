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
            ->withQueryString();

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

    public function edit(string $id)
    {
        $banner = Banner::find($id);

        if (!$banner) {
            return redirect()->back()->with('error', 'Banner not found');
        }

        return Inertia::render('admin/banners/edit', [
            'banner' => $banner,
        ]);
    }

    public function update(UpdateBannerRequest $request, string $id)
    {
        $banner = Banner::find($id);

        if (!$banner) {
            return redirect()->back()->with('error', 'Banner not found');
        }

        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($banner->image && Storage::disk('public')->exists($banner->image)) {
                Storage::disk('public')->delete($banner->image);
            }

            $data['image'] = $request->file('image')->store('banners', 'public');
        } else {
            unset($data['image']);
        }

        $banner->update($data);

        return redirect()->route('admin.banners.index')
            ->with('success', 'Banner updated successfully.');
    }

    public function destroy(string $id)
    {
        $banner = Banner::find($id);

        if (!$banner) {
            return redirect()->back()->with('error', 'Banner not found');
        }

        if ($banner->image && Storage::disk('public')->exists($banner->image)) {
            Storage::disk('public')->delete($banner->image);
        }

        $banner->delete();

        return redirect()->route('admin.banners.index')
            ->with('success', 'Banner deleted successfully.');
    }
}
