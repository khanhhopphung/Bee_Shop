<?php

namespace App\Http\Controllers\API;

use App\Models\Color;
use App\Http\Controllers\BaseController; // Nếu bạn có BaseController
use App\Http\Requests\StoreColorRequest;
use App\Http\Requests\UpdateColorRequest;
use Illuminate\Http\Request;

class ColorController extends BaseController // Thay đổi nếu cần thiết
{
    public function __construct()
    {
        $this->model = Color::class;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            return $this->get($this->model);
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "An error occurred: " . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreColorRequest $request)
    {
        try {
        return $this->insert($this->model, $request->validated());
    } catch (\Exception $e) {
        return response()->json([
            "status" => "error",
            "message" => "An error occurred: " . $e->getMessage()
        ], 500);
    }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            // Tìm kiếm bản ghi theo ID
            $color = Color::find($id);
    
            // Kiểm tra nếu không tìm thấy bản ghi
            if (!$color) {
                return response()->json([
                    "status" => "error",
                    "message" => "Không tìm thấy bản ghi với ID: " . $id
                ], 404);
            }
    
            // Kiểm tra nếu color không active
            if (!$color->is_active) {
                return response()->json([
                    "status" => "error",
                    "message" => "Màu này không hoạt động.",
                    "data" => $color
                ], 200);
            }
    
            // Nếu tìm thấy và active, trả về dữ liệu
            return $this->get($color, null, "id", $color->id);
    
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "Đã xảy ra lỗi: " . $e->getMessage()
            ], 500);
        }
    }
    

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateColorRequest $request, Color $color)
    {
        try {
            return $this->edit($color, $request->validated());
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "An error occurred: " . $e->getMessage() . " Code: " . $e->getCode() . " Line: " . $e->getLine(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Color $color)
{
    try {
        $data = [
            "is_active" => false,
            "deleted_at" => now()
        ];
        $this->edit($color, $data);

        return response()->json([
            "status" => true,
            "message" => "Xóa màu thành công",
            "data" => $data
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            "status" => "error",
            "message" => "Đã xảy ra lỗi: " . $e->getMessage()
        ], 500);
    }
}

}
