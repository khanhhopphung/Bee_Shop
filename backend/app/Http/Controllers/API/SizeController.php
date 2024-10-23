<?php

namespace App\Http\Controllers\API;

use App\Models\Size;
use App\Http\Requests\StoreSizeRequest;
use App\Http\Requests\UpdateSizeRequest;
use App\Http\Controllers\BaseController;
use Illuminate\Http\Request;
class SizeController extends BaseController
{
    public function __construct()
    {
        // Gán model Size cho BaseController
        $this->model = Size::class;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            // Lấy danh sách kích thước từ BaseController
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
    public function store(StoreSizeRequest $request)
    {
        try {
            // Sử dụng phương thức insert từ BaseController để tạo mới kích thước
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
    public function show($id)
    {
        try {
            // Tìm kiếm bản ghi theo ID
            $size = Size::find($id);
    
            // Kiểm tra nếu không tìm thấy bản ghi
            if (!$size) {
                return response()->json([
                    "status" => "error",
                    "message" => "Không tìm thấy bản ghi với ID: " . $id
                ], 404);
            }
    
            // Kiểm tra nếu size không active
            if (!$size->is_active) {
                return response()->json([
                    "status" => "error",
                    "message" => "Kích thước này không hoạt động.",
                    "data" => $size
                ], 200);
            }
    
            // Nếu tìm thấy và active, trả về dữ liệu
            return $this->get($size, null, "id", $size->id);
    
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
    public function update(UpdateSizeRequest $request, Size $size)
    {
        try {
            // Sử dụng phương thức edit từ BaseController để cập nhật kích thước
            return $this->edit($size, $request->all());
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "Đã xảy ra lỗi: " . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Size $size)
    {
        try {
            // Sử dụng phương thức edit từ BaseController để cập nhật trạng thái kích thước khi xóa
            $data = [
                "is_active" => false,
                "deleted_at" => now()
            ];
            return $this->edit($size, $data);
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "Đã xảy ra lỗi: " . $e->getMessage()
            ], 500);
        }
    }
}
