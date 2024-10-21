<?php

namespace App\Http\Controllers\API;

use App\Models\Color;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreColorRequest;
use App\Http\Requests\UpdateColorRequest;
use Illuminate\Http\Request;

class ColorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Fetch paginated color data
        $data = Color::query()->latest('id')->paginate(5);

    if ($data->isEmpty()) {
        return response()->json([
            'message' => 'Không có màu nào được tìm thấy',
            'data' => $data
        ]);
    }

    return response()->json([
        'message' => 'Danh sách màu trang số ' . request('page', 1),
        'data' => $data
    ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate and store a new color
        $validated = $request->validate([
            'color_name' => 'required|string|max:255',
            'is_active' => 'required|boolean',
        ]);

        $color = Color::create($validated);

        return response()->json([
            'message' => 'Màu mới đã được tạo',
            'data' => $color
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Retrieve color by ID
        $data = Color::query()->findOrFail($id);
        return response()->json([
            'message' => 'Chi tiết màu id = ' . $id,
            'data' => $data
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Validate the request data
        $validated = $request->validate([
            'color_name' => 'string|max:255',
            'is_active' => 'boolean',
        ]);

        // Find color and update data
        $color = Color::findOrFail($id);
        $color->update(array_filter($validated, fn($value) => !is_null($value)));

        return response()->json([
            'message' => 'Màu đã được cập nhật',
            'data' => $color
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Find and delete color by ID
        $color = Color::findOrFail($id);
        $color->delete();

        return response()->json([
            'message' => 'Màu đã được xóa'
        ], 200);
    }
}