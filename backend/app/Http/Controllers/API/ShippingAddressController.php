<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\BaseController;
use App\Models\ShippingAddress;
use App\Http\Requests\StoreShippingAddressRequest;
use App\Http\Requests\UpdateShippingAddressRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Auth;

class ShippingAddressController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function __construct()
    {
        $this->model = ShippingAddress::class;
    }

    public function index()
    {
        try {
            return $this->get($this->model);
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "Đã xảy ra lỗi: " . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreShippingAddressRequest $request)
    {
        try {
            return $this->insert($this->model, $request->all());
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "Đã xảy ra lỗi: " . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($userId)
    {
        try {
            // Lấy danh sách địa chỉ của người dùng
            $shippingAddresses = ShippingAddress::where('user_id', $userId)->get();

            // Kiểm tra nếu người dùng không có địa chỉ nào
            if ($shippingAddresses->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No shipping addresses found for this user.'
                ], 404);
            }

            // Trả về danh sách địa chỉ
            return response()->json([
                'status' => 'success',
                'shipping_addresses' => $shippingAddresses
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred: ' . $e->getMessage()
            ], 500);
        }
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ShippingAddress $shippingAddress)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {

            return $this->delete(ShippingAddress::class, $id);
        } catch (ModelNotFoundException $e) {

            return response()->json([
                "status" => "error",
                "message" => "Not fould address: " . $id,
            ], 404);
        } catch (\Exception $e) {

            return response()->json([
                "status" => "error",
                "message" => "An error occurred: " . $e->getMessage(),
            ], 500);
        }
    }
}