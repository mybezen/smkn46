<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SchoolProfile extends Model
{
    protected $fillable = [
        'type',
        'title',
        'content',
        'data',
        'main_image',
        'order',
        'is_active',
    ];

    protected $appends = [
        'main_image_url',
    ];

    public function getMainImageUrlAttribute()
    {
        if (!$this->main_image) {
            return null;
        }

        return asset('storage/' . $this->main_image);
    }

    protected $casts = [
        'data' => 'array',
    ];
}
