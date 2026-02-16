<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreExtracurricularRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|in:olahraga,seni,akademik,lainnya',
            'thumbnail' => 'nullable|image|max:2048',
        ];
    }
}