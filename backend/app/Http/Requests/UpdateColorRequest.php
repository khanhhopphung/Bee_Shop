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
        return true; // Xác thực người dùng (có thể thay đổi tùy theo yêu cầu)
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'color_name' => 'sometimes|required|string|max:255', // Tên màu là cần thiết khi được cung cấp
            'is_active' => 'sometimes|boolean', // Trạng thái hoạt động có thể cập nhật, không bắt buộc
            'image_url' => 'sometimes|nullable|url', // URL hình ảnh có thể cập nhật và có thể null
            'updated_at' => 'sometimes|nullable|date', // Thời gian cập nhật có thể cung cấp
        ];
    }

    /**
     * Handle a failed validation attempt.
     *
     * @param  \Illuminate\Contracts\Validation\Validator  $validator
     * @return void
     */
    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    {
        $errors = $validator->errors();

        throw new \Illuminate\Http\Exceptions\HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validation errors',
            'errors' => $errors
        ], 422));
    }
}
