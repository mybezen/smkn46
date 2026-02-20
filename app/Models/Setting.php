<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'school_name',
        'logo',
        'address',
        'phone',
        'email',
        'maps',
        'facebook_link',
        'instagram_link',
        'twitter_link',
        'youtube_link',
    ];

    /**
     * Singleton pattern. first() if exists, create() if not exists.
     * 
     * @return Setting
     */
    public static function instance()
    {
        return static::first() ?? static::create();
    }
}
