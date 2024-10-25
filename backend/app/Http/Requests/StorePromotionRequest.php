<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePromotionRequest extends FormRequest
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
            'code' => 'required|string|max:255|unique:promotions,code',
            'discount_type' => 'required|string|in:percentage,amount', // Chỉ cho phép 2 giá trị
            'discount_value' => 'required|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'start_date' => 'required|date|before_or_equal:end_date', // Start date phải nhỏ hơn end date
            'end_date' => 'required|date|after_or_equal:start_date', // End date phải lớn hơn hoặc bằng start date
            'is_active' => 'required|boolean',
            'min_purchase_amount' => 'nullable|numeric|min:0',
            'tier_id' => 'required|integer|exists:tiers,id',
        ];
    }
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
