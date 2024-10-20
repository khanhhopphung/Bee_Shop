<?php

namespace App\Http\Controllers\API;

use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
// use App\Http\Controllers\Controller;    
use Illuminate\Routing\Controller;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
{
    try {
        $categories = Category::where('is_active', true)->latest("id")->get();
        if ($categories->isEmpty()) {
            return response()->json([
                "status" => "error",
                "message" => "No active categories found."
            ], 404);
        }
        return response()->json([
            "status" => "success",
            "datas" => $categories,
            "total" => $categories->count()
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            "status" => "error",
            "message" => "An error occurred: " . $e->getMessage()
        ], 500);
    }
}


    public function store(StoreCategoryRequest $request)
    {
        try {
            $categories = Category::create($request->all());
                    return response()->json([
                    "status" => "success",
                    "message" => "them thanh cong",
                    "datas" => $categories
            ], 200);
        }
        catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "An error occurred: " . $e->getMessage()
            ], 500);

        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        if ($category->is_active == true) {
            return response()->json([
                "status" => "success",
                "datas" => $category
            ], 200);
        } else if ($category->is_active == false) {
            return response()->json([
                "status" => "success",
                "message" => "San pham da bi aarn di",
                "datas" => $category
            ], 200);
        }
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        try {
            $category->update($request->all());
                    return response()->json([
                    "status" => "success",
                    "message" => "update thanh cong",
                    "datas" => $category
            ], 200);
        }
        catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "An error occurred: " . $e->getMessage()
            ], 500);

        }
        
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        $category->update(["is_active" => false]);
        return response()->json([
            "status" => "success",
            "message" => "update thanh cong"
        ], 200);
    }
}
