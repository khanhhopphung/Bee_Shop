<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBlogRequest;
use App\Models\Blog;
use Attribute;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

class BlogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $blogs = Blog::all();

        return response()->json([
            "status" => "success",
            'message' => 'danh sach blogs . ' . request('page', 1),
            'data' => $blogs
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBlogRequest  $request)
    {
        $blogs = Blog::query()->create($request->all());
        return response()->json([
            "status" => "success",
            'message' => 'Tao moi thanh cong ng dung',
            'data' => $blogs
        ], HttpResponse::HTTP_CREATED);
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {

        try {
            $blogs = Blog::query()->findOrFail($id);

            return response()->json([
                "status" => "success",
                'message' => 'chi tiet blogs id = ' . $id,
                'data' => $blogs
            ]);
        } catch (\Throwable $th) {
            if ($th instanceof ModelNotFoundException) {
                return response()->json([
                    'message' => 'Khong tim thay blogs co id = ' . $id,
                ], HttpResponse::HTTP_NOT_FOUND);
            }

            return response()->json([
                "status" => "errors",
                'message' => 'Khong tim thay blogs co id = ' . $id,
            ], HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Blog $blog)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $blog = Blog::query()->findOrFail($id);
            $blog->update($request->all());

            return response()->json([
                "status" => "success",
                'message' => 'Cập nhật thành công blog với ID = ' . $id,
                'data' => $blog
            ]);
        } catch (ModelNotFoundException $th) {
            return response()->json([
                "status" => "error",
                'message' => 'Không tìm thấy blog với ID = ' . $id,
            ], HttpResponse::HTTP_NOT_FOUND);
        } catch (\Throwable $th) {
            return response()->json([
                "status" => "error",
                'message' => 'Lỗi khi cập nhật blog: ' . $th->getMessage(),
            ], HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $blog = Blog::findOrFail($id);

            $blog->update(['is_active' => false]);

            return response()->json([
                "status" => "success",
                'message' => "Đã vô hiệu hóa blog thành công.",
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                "status" => "error",
                'message' => "Không tìm thấy blog với ID = " . $id,
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                'message' => "Lỗi khi vô hiệu hóa blog: " . $e->getMessage(),
            ], 500);
        }
    }
}
