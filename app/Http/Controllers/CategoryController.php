<?php

namespace App\Http\Controllers;

use App\Http\Requests\CategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::all();

        // return ;
    }

    public function table()
    {
        $categories = Category::all();

        // return ;
    }

    public function create()
    {
        // return ;
    }

    public function store(CategoryRequest $request)
    {
        $validated = $request->validated();

        $baseSlug = Str::slug($validated['name']);
        $newSlug = $baseSlug;
        $counter = 1;

        while (
            Category::where('slug', $newSlug)->exists()
        ) {
            $newSlug = $baseSlug . '-' . $counter;
            $counter++;
        }

        $validated['slug'] = $newSlug;

        Category::create($validated);

        return redirect()->back()->with('success', 'Category created successfully.');
    }

    public function edit(string $slug)
    {
        $category = Category::where('slug', $slug)->first();

        if (!$category) {
            return redirect()->back()->with('error', 'Category not found.');
        }

        // return ;
    }

    public function update(CategoryRequest $request, string $slug)
    {
        $category = Category::where('slug', $slug)->first();

        if (!$category) {
            return redirect()->back()->with('error', 'Category not found.');
        }

        $validated = $request->validated();

        if ($validated['name'] !== $category->name) {
            $baseSlug = Str::slug($validated['name']);
            $newSlug = $baseSlug;
            $counter = 1;

            while (
                Category::where('slug', $newSlug)
                ->where('id', '!=', $category->id)->exists()
            ) {
                $newSlug = $baseSlug . '-' . $counter;
                $counter++;
            }

            $validated['slug'] = $newSlug;
        }

        $category->update($validated);

        return redirect()->back()->with('success', 'Category updated successfully.');
    }

    public function destroy(string $slug)
    {
        $category = Category::where('slug', $slug)->first();

        if (!$category) {
            return redirect()->back()->with('error', 'Category not found.');
        }

        $category->delete();

        return redirect()->back()->with('success', 'Category deleted successfully.');
    }
}
