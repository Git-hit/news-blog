<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = [
        'title',
        'content',
        'image',
        'categories',
        'meta_title',
        'meta_description',
        'focus_keyword',
        'slug',
        'canonical_url',
        'robots_tag',
        'og_title',
        'og_description',
        'og_image',
        'featured',
    ];
}
