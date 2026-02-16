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

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($major) {
            if (empty($major->slug)) {
                $major->slug = Str::slug($major->name);
            }
        });

        static::updating(function ($major) {
            if ($major->isDirty('name') && empty($major->slug)) {
                $major->slug = Str::slug($major->name);
            }
        });
    }
}