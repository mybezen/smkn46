<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMajorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:majors,slug',
            'description' => 'required|string',
            'icon' => 'nullable|image|max:2048',
            'preview_image' => 'nullable|image|max:4096',
        ];
    }
}