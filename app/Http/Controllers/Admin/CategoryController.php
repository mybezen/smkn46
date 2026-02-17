<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::query()
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->search;

                $query->where('name', 'like', '%' . $search . '%');
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/categories/index', [
            'categories' => $categories,
            'filters'    => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/categories/create');
    }

    public function store(StoreCategoryRequest $request)
    {
        $validated = $request->validated();

        $baseSlug = Str::slug($validated['name']);
        $newSlug  = $baseSlug;
        $counter  = 1;

        while (Category::where('slug', $newSlug)->exists()) {
            $newSlug = $baseSlug . '-' . $counter;
            $counter++;
        }

        $validated['slug'] = $newSlug;

        Category::create($validated);

        return redirect('/admin/categories')->with('success', 'Category created successfully.');
    }

    public function edit(string $slug)
    {
        $category = Category::where('slug', $slug)->first();

        if (!$category) {
            return redirect()->back()->with('error', 'Category not found.');
        }

        return Inertia::render('admin/categories/edit', [
            'category' => $category,
        ]);
    }

    public function update(UpdateCategoryRequest $request, string $slug)
    {
        $category = Category::where('slug', $slug)->first();

        if (!$category) {
            return redirect()->back()->with('error', 'Category not found.');
        }

        $validated = $request->validated();

        if ($validated['name'] !== $category->name) {
            $baseSlug = Str::slug($validated['name']);
            $newSlug  = $baseSlug;
            $counter  = 1;

            while (
                Category::where('slug', $newSlug)
                    ->where('id', '!=', $category->id)
                    ->exists()
            ) {
                $newSlug = $baseSlug . '-' . $counter;
                $counter++;
            }

            $validated['slug'] = $newSlug;
        }

        $category->update($validated);

        return redirect('/admin/categories')->with('success', 'Category updated successfully.');
    }

    public function destroy(string $slug)
    {
        $category = Category::where('slug', $slug)->first();

        if (!$category) {
            return redirect()->back()->with('error', 'Category not found.');
        }

        $category->delete();

        return redirect('/admin/categories')->with('success', 'Category deleted successfully.');
    }
}