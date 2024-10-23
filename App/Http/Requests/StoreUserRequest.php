<?php

namespace App\Http\Requests;
  
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Response;

class StoreUserRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Chỉnh sửa theo nhu cầu của bạn, nếu cần xác thực người dùng
    }

    public function rules()
    {
        return [
            'username' => 'required|string|max:255|unique:users,username',
            'password_hash' => 'required|string|min:8',
            'email' => 'required|email|max:255|unique:users,email',
            'phone' => 'nullable|string|max:15',
            'role_id' => 'required|exists:roles,id', // Giả sử bạn có bảng roles
            'tier_id' => 'nullable|exists:tiers,id', // Giả sử bạn có bảng tiers
        ];
    }

    public function messages()
    {
        return [
            'username.required' => 'Username is required.',
            'username.unique' => 'This username has already been taken.',
            'password_hash.required' => 'Password is required.',
            'password_hash.min' => 'Password must be at least 8 characters.',
            'email.required' => 'Email is required.',
            'email.email' => 'Email must be a valid email address.',
            'email.unique' => 'This email has already been taken.',
            'phone.max' => 'Phone number cannot exceed 15 characters.',
            'role_id.required' => 'Role is required.',
            'role_id.exists' => 'The selected role is invalid.',
            'tier_id.exists' => 'The selected tier is invalid.',
        ];
    }
    protected function failedValidation(Validator $validator)
    {
        $errors = $validator->errors();
        $response = response()->json([
            'errors' => $errors ->messages(),
        ], 400); 
        throw new HttpResponseException($response);


       
    }
}
