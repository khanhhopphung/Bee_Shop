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
                "message" => "An error occurred: " . $e->getMessage()
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
            $image = Image::find($id);

            // Kiểm tra nếu không tìm thấy bản ghi
            if (!$image) {
                return response()->json([
                    "status" => "error",
                    "message" => "Không tìm thấy bản ghi với ID: " . $id
                ], 404);
            }

            // Kiểm tra nếu image không active
            if (!$image->is_active) {
                return response()->json([
                    "status" => "error",
                    "message" => "Hình ảnh này không hoạt động.",
                    "data" => $image
                ], 200);
            }

            // Nếu tìm thấy và active, trả về dữ liệu
            return $this->get($image, null, "id", $image->id);
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "An error occurred: " . $e->getMessage()
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
            $data = [
                "is_active" => false,
                "deleted_at" => now()
            ];
            $this->edit($image, $data);

            return response()->json([
                "status" => true,
                "message" => "Soft delete successful",
                "data" => $data
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "An error occurred: " . $e->getMessage()
            ], 500);
        }
    }
}
