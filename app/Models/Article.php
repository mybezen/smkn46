<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = [
        'author_id',
        'category_id',
        'title',
        'slug',
        'content',
        'thumbnail',
        'is_published',
    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id', 'id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'id');
    }
}
