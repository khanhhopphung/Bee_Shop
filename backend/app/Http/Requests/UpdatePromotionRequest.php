<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePromotionRequest extends FormRequest
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
            'code' => 'sometimes|required|string|max:255|unique:promotions,code,' . $this->promotion->id,
            'discount_type' => 'sometimes|required|string|in:percentage,amount',
            'discount_value' => 'sometimes|required|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'start_date' => 'sometimes|required|date|before_or_equal:end_date',
            'end_date' => 'sometimes|required|date|after_or_equal:start_date',
            'is_active' => 'sometimes|required|boolean',
            'min_purchase_amount' => 'nullable|numeric|min:0',
            'tier_id' => 'sometimes|required|integer|exists:tiers,id',
        ];
    }

    /**
     * Tùy chỉnh thông báo lỗi nếu cần.
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
