<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBlogRequest;
use App\Models\Blog;
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
            'message' => 'Tao moi thanh cong ng dung',
            'data' => $blogs
        ], HttpResponse::HTTP_CREATED);
        
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id )
    {

        try {
            $blogs = Blog::query()->findOrFail($id);

            return response()->json([
                'message' => 'chi tiet blogs id = ' . $id,
                'data' => $blogs
            ]);
        } catch (\Throwable $th) {
            if ($th instanceof ModelNotFoundException){
                return response()->json([
                    'message' => 'Khong tim thay blogs co id = ' . $id,
                ], HttpResponse::HTTP_NOT_FOUND);
            }

            return response()->json([
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
    public function update(request $request, string $id)
    {
        $blog1 = Blog::query()->findOrFail($id);

        $blog1->update(request()->all());

        return response()->json($blog1);


    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $blog = Blog::findOrFail($id);
            $blog->delete(); 
    
            return response()->json([
                'message' => 'Xóa thành công blog với ID = ' . $id,
            ], HttpResponse::HTTP_OK);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Không tìm thấy blog với ID = ' . $id,
            ], HttpResponse::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi xóa blog: ' . $e->getMessage(),
            ], HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

    }
}
