<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreProductVariantRequest extends FormRequest
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
            'product_id' => 'required|exists:products,id',  
            'size_id' => 'required|exists:sizes,id',         
            'color_id' => 'required|exists:colors,id',       
            'price' => 'required|numeric|min:0',             
            'stock' => 'required|integer|min:0',             
            'is_active' => 'boolean',                        
            'created_at' => 'nullable|date',                 
            'updated_at' => 'nullable|date',                 
            'deleted_at' => 'nullable|date',                 
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
