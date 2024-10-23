<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateImageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            //
            'product_id' => 'sometimes|integer|exists:products,id',
            'variant_id' => 'sometimes|integer|exists:product_variants,id',
            'image_url' => 'sometimes|url|max:2048', // Ensure the URL is valid and not too long
            'alt_text' => 'sometimes|nullable|string|max:255', // Allow for alt text but not required
            'is_active' => 'sometimes|boolean', // Ensure it's a boolean if present
        ];
    }
}
