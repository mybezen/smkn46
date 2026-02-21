<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Banner extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'image',
        'link',
        'is_active',
        'order',
    ];
    
    protected $appends = [
        'image_url',
    ];
    
    public function getImageUrlAttribute()
    {
        if (!$this->image) {
            return null;
        }
        
        return asset('storage/' . $this->image);
    }

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];
}