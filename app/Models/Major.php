<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Major extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'icon',
        'preview_image',
    ];

    protected $appends = [
        'icon_url',
        'preview_image_url',
    ];

    public function getIconUrlAttribute()
    {
        if (!$this->icon) {
            return null;
        }

        return asset('storage/' . $this->icon);
    }

    public function getPreviewImageUrlAttribute()
    {
        if (!$this->preview_image) {
            return null;
        }

        return asset('storage/' . $this->preview_image);
    }

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($major) {
            if ($major->isDirty('name')) {
                $major->slug = static::generateUniqueSlug($major->name, $major->id);
            }
        });
    }

    protected static function generateUniqueSlug(string $name, $ignoreId = null): string
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $counter = 1;

        while (
            static::where('slug', $slug)
            ->when($ignoreId, fn($q) => $q->where('id', '!=', $ignoreId))
            ->exists()
        ) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }
}
