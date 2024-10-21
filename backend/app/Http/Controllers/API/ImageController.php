<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Image;
use App\Http\Requests\StoreImageRequest;
use App\Http\Requests\UpdateImageRequest;
use Illuminate\Http\Request;
class ImageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Image::query()->latest('id')->paginate(5);
        return response()->json([
            'message' => 'Danh sách Ảnh trang số ' . request('page', 1),
            'data' => $data
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(request $request)
    {
        //
        $validated = $request->validate([
            'product_id' => 'required|integer',
            'variant_id' => 'required|integer',
            'image_url' => 'required|string',
            'alt_text' => 'nullable|string',
            'is_active' => 'required|boolean',
        ]);

        // Tạo mới ảnh
        $image = Image::create($validated);

        return response()->json([
            'message' => 'Ảnh mới đã được tạo',
            'data' => $image
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Image $image)
    {
        //
        return response()->json([
            'message' => 'Chi tiết ảnh',
            'data' => $image
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Image $image)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(request $request, Image $image)
    {
        
        $validated = $request->validate([
            'product_id' => 'sometimes|required|integer',
            'variant_id' => 'sometimes|required|integer',
            'image_url' => 'sometimes|required|string',
            'alt_text' => 'nullable|string',
            'is_active' => 'sometimes|required|boolean',
        ]);

        // Update the image with validated data
        $image->update($validated);

        return response()->json([
            'message' => 'Ảnh đã được cập nhật',
            'data' => $image
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Image $image)
    {
        //
        $image->delete();

        return response()->json([
            'message' => 'Ảnh đã được xóa'
        ], 200);
    }
}
