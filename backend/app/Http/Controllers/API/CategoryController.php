<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\BaseController;
use App\Http\Controllers\BaseCrudController;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;

class CategoryController extends BaseController
{
    public function __construct()
    {
        $this->model = Category::class;
    }

    public function index()
    {
        try {
            return $this->get( $this->model);
      
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
            return $this->insert($this->model, $request->all());
        }
        catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "An error occurred: " . $e->getMessage()
            ], 500);

        }
    }

    // /**
    //  * Display the specified resource.
    //  */
    public function show(Category $category)
    {
        if ($category -> is_active == true) {
            return $this->get($category,null,"id",$category->id);
          }
          else if ($category -> is_active ==false) {
              return response()->json([
                  "status" => "error",
                  "message" => "This category is not active.",
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
            return $this->edit($category, $request->all());
        }
        catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "An error occurred: " . $e->getMessage()."Code :".$e->getCode() ."line:".$e->getLine(),

            ], 500);

        }

    }

    // /**
    //  * Remove the specified resource from storage.
    //  */
    public function destroy(Category $category)
    {
        $data = [
            "is_active" => false,
            "deleted_at" => date('Y-m-d H:i:s')
        ];
        return $this->edit($category, $data );
        
    }
}
