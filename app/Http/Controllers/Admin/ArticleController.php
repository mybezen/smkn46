<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Article\StoreArticleRequest;
use App\Http\Requests\Article\UpdateArticleRequest;
use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        $articles = Article::with(['author', 'category'])
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->search;

                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', '%' . $search . '%')
                        ->orWhere('content', 'like', '%' . $search . '%');
                });
            })
            ->when($request->filled('category'), function ($query) use ($request) {
                $query->whereHas('category', function ($q) use ($request) {
                    $q->where('slug', $request->category);
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/articles/index', [
            'articles'   => $articles,
            'categories' => Category::all(),
            'filters'    => $request->only(['search', 'category']),
        ]);
    }

    public function create()
    {
        $categories = Category::all();

        return Inertia::render('admin/articles/create', [
            'categories' => $categories,
        ]);
    }

    public function store(StoreArticleRequest $request)
    {
        $validated = $request->validated();

        $validated['author_id'] = Auth::user()->id;

        $baseSlug = Str::slug($validated['title']);
        $newSlug  = $baseSlug;
        $counter  = 1;

        while (Article::where('slug', $newSlug)->exists()) {
            $newSlug = $baseSlug . '-' . $counter;
            $counter++;
        }

        $validated['slug'] = $newSlug;

        if ($request->hasFile('thumbnail')) {
            $file = $request->file('thumbnail');

            $validated['thumbnail'] = Storage::disk('public')->putFile('articles', $file);
        }

        Article::create($validated);

        return redirect('/admin/articles')->with('success', 'Article created successfully.');
    }

    public function show(string $slug)
    {
        $article = Article::with(['author', 'category'])
            ->where('slug', $slug)
            ->first();

        if (!$article) {
            return redirect('/admin/articles')->with('error', 'Article not found.');
        }

        return Inertia::render('admin/articles/show', [
            'article' => $article,
        ]);
    }

    public function edit(string $slug)
    {
        $article = Article::with(['author', 'category'])
            ->where('slug', $slug)
            ->first();

        if (!$article) {
            return redirect()->back()->with('error', 'Article not found.');
        }

        $categories = Category::all();

        return Inertia::render('admin/articles/edit', [
            'article'    => $article,
            'categories' => $categories,
        ]);
    }

    public function update(UpdateArticleRequest $request, string $slug)
    {
        $article = Article::where('slug', $slug)->first();

        if (!$article) {
            return redirect()->back()->with('error', 'Article not found.');
        }

        $validated = $request->validated();

        if ($validated['title'] !== $article->title) {
            $baseSlug = Str::slug($validated['title']);
            $newSlug  = $baseSlug;
            $counter  = 1;

            while (
                Article::where('slug', $newSlug)
                    ->where('id', '!=', $article->id)
                    ->exists()
            ) {
                $newSlug = $baseSlug . '-' . $counter;
                $counter++;
            }

            $validated['slug'] = $newSlug;
        }

        if ($request->hasFile('thumbnail')) {
            if ($article->thumbnail && Storage::disk('public')->exists($article->thumbnail)) {
                Storage::disk('public')->delete($article->thumbnail);
            }

            $file = $request->file('thumbnail');

            $validated['thumbnail'] = Storage::disk('public')->putFile('articles', $file);
        } else {
            unset($validated['thumbnail']);
        }

        $article->update($validated);

        return redirect('/admin/articles')->with('success', 'Article updated successfully.');
    }

    public function destroy(string $slug)
    {
        $article = Article::where('slug', $slug)->first();

        if (!$article) {
            return redirect()->back()->with('error', 'Article not found.');
        }

        if ($article->thumbnail && Storage::disk('public')->exists($article->thumbnail)) {
            Storage::disk('public')->delete($article->thumbnail);
        }

        $article->delete();

        return redirect('/admin/articles')->with('success', 'Article deleted successfully.');
    }

    public function updateStatus(string $slug)
    {
        $article = Article::where('slug', $slug)->first();

        if (!$article) {
            return redirect()->back()->with('error', 'Article not found.');
        }

        $article->update([
            'is_published' => !$article->is_published,
        ]);

        return back()->with('success', 'Article status updated successfully.');
    }
}