<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Response;

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
            'code' => 'required|string|max:50|unique:promotions,code', 
            'discount_type' => 'required|in:percentage', 
            'discount_value' => 'required|numeric|min:0|max:100', 
            'usage_limit' => 'required|integer|min:1', 
            'start_date' => 'required|date|before_or_equal:end_date', 
            'end_date' => 'nullable|date|after_or_equal:start_date', 
            'is_active' => 'boolean', 
            'min_purchase_amount' => 'nullable|numeric|min:0', 
            'tier_id' => 'required|exists:tiers,id',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        $errors = $validator->errors();

        $response = response()->json([
            'errors' => $errors->messages(),
        ], Response::HTTP_BAD_REQUEST);

        throw new HttpResponseException($response);
    }
}
