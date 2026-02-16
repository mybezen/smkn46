<?php

namespace App\Http\Controllers;

use App\Http\Requests\ArticleRequest;
use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ArticleController extends Controller
{
    public function index()
    {
        $articles = Article::with(['author', 'category'])
            ->where('is_published', true)->get();

        $categories = Category::all();

        // return Inertia::render('#', [
        //     'article' => $article,
        //     'categories' => $categories, // kalo butuh data category
        // ]);
    }

    public function table()
    {
        $articles = Article::with(['author', 'category'])->get();

        // ini buat table admin
        // return ;
    }

    public function show(string $slug)
    {
        $article = Article::with(['author', 'category'])
            ->where('slug', $slug)->first();

        if (!$article) {
            return redirect()->back()->with('error', 'Article not found.');
        }

        // return ;
    }

    public function create()
    {
        $categories = Category::all();

        // return ;
    }

    public function store(ArticleRequest $request)
    {
        $validated = $request->validated();

        $validated['author_id'] = Auth::user()->id;

        $baseSlug = Str::slug($validated['title']);
        $newSlug = $baseSlug;
        $counter = 1;

        while (
            Article::where('slug', $newSlug)->exists()
        ) {
            $newSlug = $baseSlug . '-' . $counter;
            $counter++;
        }

        $validated['slug'] = $newSlug;

        if ($request->hasFile('thumbnail')) {
            $file = $request->file('thumbnail');

            $validated['thumbnail'] = Storage::disk('public')->putFile('articles', $file);
        }

        Article::create($validated);

        return redirect()->back()->with('success', 'Article created successfully.');
    }

    public function edit(string $slug)
    {
        $article = Article::with(['author', 'category'])
            ->where('slug', $slug)->first();

        if (!$article) {
            return redirect()->back()->with('error', 'Article not found.');
        }

        $categories = Category::all();

        // return Inertia::render('#', [
        //     'article' => $article,
        //     'categories' => $categories,
        // ]);
    }

    public function update(ArticleRequest $request, string $slug)
    {
        $article = Article::where('slug', $slug)->first();

        if (!$article) {
            return redirect()->back()->with('error', 'Article not found.');
        }

        $validated = $request->validated();

        if ($validated['title'] !== $article->title) {
            $baseSlug = Str::slug($validated['title']);
            $newSlug = $baseSlug;
            $counter = 1;

            while (
                Article::where('slug', $newSlug)
                ->where('id', '!=', $article->id)->exists()
            ) {
                $newSlug = $baseSlug . '-' . $counter;
                $counter++;
            }

            $validated['slug'] = $newSlug;
        }

        if ($request->hasFile('thumbnail')) {
            if ($article->image && Storage::disk('public')->exists($article->image)) {
                Storage::disk('public')->delete($article->image);
            }

            $file = $request->file('thumbnail');

            $validated['thumbnail'] = Storage::disk('public')->putFile('articles', $file);
        } else {
            unset($validated['thumbnail']);
        }

        $article->update($validated);

        return redirect()->back()->with('success', 'Article updated successfully.');
    }

    public function destroy(string $slug)
    {
        $article = Article::where('slug', $slug)->first();

        if (!$article) {
            return redirect()->back()->with('error', 'Article not found.');
        }

        if ($article->image && Storage::disk('public')->exists($article->image)) {
            Storage::disk('public')->delete($article->image);
        }

        $article->delete();

        return redirect()->back()->with('success', 'Article deleted successfully.');
    }

    public function updateStatus(string $slug)
    {
        $article = Article::where('slug', $slug)->first();

        if (!$article) {
            return redirect()->back()->with('error', 'Article not found.');
        }

        if ($article->is_published) {
            $article->update(['is_published' => false]);
        } else {
            $article->update(['is_published' => true]);
        }

        return back()->with('success', 'Article status updated successfully.');
    }
}
