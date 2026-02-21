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
        'facebook',
        'instagram',
        'twitter',
        'youtube',
    ];

    protected $appends = [
        'logo_url',
    ];

    public function getLogoUrlAttribute()
    {
        if (!$this->logo) {
            return null;
        }

        return asset('storage/' . $this->logo);
    }

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
