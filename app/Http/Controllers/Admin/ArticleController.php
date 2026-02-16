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
    public function index()
    {
        $articles = Article::with(['author', 'category'])->get();

        // return $articles;
    }

    public function create()
    {
        $categories = Category::all();

        // return $categories;
    }

    public function store(StoreArticleRequest $request)
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

        return redirect()->route('admin.articles.index')->with('success', 'Article created successfully.');
    }

    public function edit(string $slug)
    {
        $article = Article::with(['author', 'category'])
            ->where('slug', $slug)->first();

        if (!$article) {
            return redirect()->back()->with('error', 'Article not found.');
        }

        $categories = Category::all();

        // return [
        //     'article' => $article,
        //     'categories' => $categories,
        // ];
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

        return redirect()->route('admin.articles.index')->with('success', 'Article updated successfully.');
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

        return redirect()->route('admin.articles.index')->with('success', 'Article deleted successfully.');
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
