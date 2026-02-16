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
}
