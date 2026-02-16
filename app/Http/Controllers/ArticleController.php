<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ArticleController extends Controller
{
    public function index()
    {
        $articles = Article::with(['author', 'category'])
            ->where('is_published', true)->get();

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
