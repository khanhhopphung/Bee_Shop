<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\BaseController;
use App\Http\Requests\StoreBlogRequest;
use App\Models\Blog;
use Attribute;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

class BlogController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function __construct()
    {
        $this->model = Blog::class;
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
    public function store(StoreBlogRequest  $request)
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
    public function show(Blog $blog)
    {
        try {
            if ($blog->is_active) {
                return $this->get($blog, null, "id", $blog->id);
            } else {
                return response()->json([
                    "status" => "error",
                    "message" => "This blog is not active.",
                    "data" => $blog
                ], 200);
            }
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "Đã xảy ra lỗi: " . $e->getMessage()
            ], 500);
        }
    }


    /**
     * Show the form for editing the specified resource.
     */


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Blog $blog)
    {
        try {
            return $this->edit($blog, $request->all());
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
    public function destroy(Blog $blog) 

    {
        try {
            $data = [
                "is_active" => false,
                "deleted_at" => now()
            ];
            $this->edit($blog, $data);

            return response()->json([
                "status" => true,
                "message" => "Xóa blog thành công",
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
