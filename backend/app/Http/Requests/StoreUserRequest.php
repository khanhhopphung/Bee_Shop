<?php

namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Response;

class StoreUserRequest extends FormRequest
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
            'username' => 'required|string|max:255|unique:users,username',
            'email' => 'required|email|max:255|unique:users,email',
            'phone' => 'required|string|min:10|max:20',
        ];
    }

    public function messages()
    {
        return [
            'username.required' => 'Phải nhập tên đăng nhập',
            'username.unique' => 'Tên đăng nhập đã tồn tại',
            'email.required' => 'Phải nhập Email',
            'email.unique' => 'Email đã tồn tại',
            'phone.required' => 'Phải nhập số điện thoại',
            'phone.unique' => 'Số điện thoại đã tồn tại',
            
        ];
    }
    protected function failedValidation(Validator $validator)
    {
        // try{
            $errors = $validator->errors();

        $response = response()->json([
            'status' => 'error',
            'errors' => $errors->messages(),

        ], Response::HTTP_BAD_REQUEST);

        throw new HttpResponseException($response);

    }
}
