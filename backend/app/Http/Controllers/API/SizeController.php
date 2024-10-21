<?php

namespace App\Http\Controllers\API;

use App\Models\Size;
use App\Http\Requests\StoreSizeRequest;
use App\Http\Requests\UpdateSizeRequest;
use App\Http\Controllers\Controller;

class SizeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Lấy danh sách kích thước
        $data = Size::query()->latest('id')->paginate(5);
        return response()->json([
            'message' => 'Danh sách kích thước trang số ' . request('page', 1),
            'data' => $data
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSizeRequest $request)
    {
        // Xác thực và lưu kích thước mới
        $validated = $request->validated();

        // Tạo mới kích thước
        $size = Size::create([
            'size_name' => $validated['size_name'],
            'is_active' => $validated['is_active'],
        ]);

        return response()->json([
            'message' => 'Kích thước mới đã được tạo',
            'data' => $size
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Size $size)
    {
        // Lấy chi tiết một kích thước
        return response()->json([
            'message' => 'Chi tiết kích thước',
            'data' => $size
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSizeRequest $request, Size $size)
    {
        // Xác thực và cập nhật kích thước
        $validated = $request->validated();
        $size->update(array_filter($validated, fn($value) => !is_null($value)));

        return response()->json([
            'message' => 'Kích thước đã được cập nhật',
            'data' => $size
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Size $size)
    {
        // Xóa kích thước
        $size->delete();

        return response()->json([
            'message' => 'Kích thước đã được xóa'
        ], 200);
    }
}