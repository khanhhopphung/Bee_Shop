<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\BaseController;
use App\Models\Image;
use App\Http\Requests\StoreImageRequest;
use App\Http\Requests\UpdateImageRequest;

class ImageController extends BaseController
{
    public function __construct()
    {
        $this->model = Image::class;
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
                "message" => "Đã xảy ra lỗi: " . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreImageRequest $request)
    {
        try {
            return $this->insert($this->model, $request->validated());
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
            $image = Image::find($id);
    
            // Kiểm tra nếu không tìm thấy thì trả về thông báo lỗi
            if (!$image) {
                return response()->json([
                    "status" => "error",
                    "message" => "Không tìm thấy bản ghi với ID: " . $id
                ], 404);
            }
    
            // Nếu tìm thấy, trả về dữ liệu
            return $this->get($image, null, "id", $image->id);
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
    public function update(UpdateImageRequest $request, Image $image)
    {
        try {
            return $this->edit($image, $request->validated());
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
    public function destroy(Image $image)
{
    try {
        // Thực hiện xóa mềm
        $image->delete();

        return response()->json([
            "status" => "success",
            "message" => "Xóa mềm thành công",
            "data" => [
                "is_active" => false,
                "deleted_at" => $image->deleted_at
            ]
        ]);
    } catch (\Exception $e) {
        return response()->json([
            "status" => "error",
            "message" => "Đã xảy ra lỗi: " . $e->getMessage()
        ], 500);
    }
}

}
