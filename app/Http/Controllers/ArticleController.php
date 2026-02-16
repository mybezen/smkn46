<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        $articles = Article::with(['author', 'category'])
            ->where('is_published', true)
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

        $categories = Category::all();

        // return [
        //  'articles' => $article,
        //  'categories' => $categories,
        // ];
    }

    public function show(string $slug)
    {
        $article = Article::with(['author', 'category'])
            ->where('slug', $slug)->first();

        if (!$article) {
            return redirect()->back()->with('error', 'Article not found.');
        }

        // return $article;
    }
}
