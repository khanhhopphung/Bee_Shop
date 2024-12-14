<?php

namespace App\Http\Controllers\API;


use App\Http\Controllers\BaseController;
use App\Http\Requests\StoreBlogRequest;
use App\Http\Requests\UpdateBlogRequest;
use App\Models\Blog;
use Attribute;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Log;

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
            // $blogs= Blog::where('is_active', 1)->orderBy('id','desc')->get();

            return $this->get( $this->model);   
            // return $this->success($blogs);
           
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
    public function store(StoreBlogRequest $request)
    {
        try {

            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('public/images');
                $data = $request->all();

                $data['image'] = str_replace('public/', '', $path);

                return $this->insert($this->model, $data);
            }

            return response()->json([
                "status" => "error",
                "message" => "Không có file ảnh."
            ], 400);
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

    
    
     public function update(Request $request, Blog $blog)
     {
         try {
             // Log toàn bộ thông tin Request
             Log::info("Full Request Data:", [
                 "request" => $request->all(),
                 "files" => $request->files->all()
             ]);
     
             // Lấy tất cả dữ liệu từ request (ngoại trừ file)
             $data = $request->except('image'); 
     
             if ($request->hasFile('image')) {
                 // Log khi nhận được file ảnh
                 Log::info("File is uploaded.", ["file_name" => $request->file('image')->getClientOriginalName()]);
     
                 $path = $request->file('image')->store('public/images');
                 $data['image'] = str_replace('public/', '', $path);
     
                 Log::info("Image Uploaded Path:", [$path]);
             } else {
                 Log::info("No image found in request.");
             }
     
             // Cập nhật dữ liệu
             $isUpdated = $blog->update($data);
     
             Log::info("Update Status:", [$isUpdated]);
     
             return response()->json([
                 "status" => true,
                 "message" => "Blog updated successfully",
                 "data" => $blog->refresh()
             ], 200);
         } catch (\Exception $e) {
             Log::error("Update Error:", ["message" => $e->getMessage()]);
     
             return response()->json([
                 "status" => "error",
                 "message" => "Error: " . $e->getMessage()
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
