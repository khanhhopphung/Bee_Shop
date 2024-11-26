<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateProductVariantRequest extends FormRequest
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
           'product_id' => 'required|exists:products,id',  // Sản phẩm phải tồn tại trong bảng `products`
            'size_id' => 'required|exists:sizes,id',        // Kích thước phải tồn tại trong bảng `sizes`
            'color_id' => 'required|exists:colors,id',      // Màu sắc phải tồn tại trong bảng `colors`
            'price' => 'required|numeric|min:0',           // Giá phải là số >= 0
            'stock' => 'required|integer|min:0',           // Tồn kho phải là số nguyên >= 0
            'is_active' => 'boolean',                      // Trạng thái hoạt động phải là true/false
            'images.*' => 'nullable|image|max:2048',       // Các ảnh phải là file hợp lệ và kích thước <= 2MB
        ];
    }

    /**
     * Xử lý lỗi validation và trả về JSON response.
     *
     * @param  \Illuminate\Contracts\Validation\Validator  $validator
     * @return void
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validation errors',
            'errors' => $validator->errors()
        ], 422));
    }
}
