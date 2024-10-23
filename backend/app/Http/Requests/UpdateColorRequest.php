<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateColorRequest extends FormRequest
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
            'color_name' => 'sometimes|string|max:255',  // Đôi khi cần cập nhật, không bắt buộc
            'is_active' => 'sometimes|boolean',  // Đôi khi cần cập nhật, không bắt buộc
        ];
    }
}
