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
        return false;
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
            'product_id' => 'sometimes|required|integer',
            'variant_id' => 'sometimes|required|integer',
            'image_url' => 'sometimes|required|string',
            'alt_text' => 'nullable|string',
            'is_active' => 'sometimes|required|boolean',
        ];
    }
}
