<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Achievement extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'thumbnail',
        'category',
    ];
    
    protected $appends = [
        'thumbnail_url',
    ];
    
    public function getThumbnailUrlAttribute()
    {
        if (!$this->thumbnail) {
            return null;
        }
        
        return asset('storage/' . $this->thumbnail);
    }

    protected $casts = [
        'category' => 'string',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];
}