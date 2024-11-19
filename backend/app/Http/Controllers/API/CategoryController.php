<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\BaseController;
use App\Http\Controllers\BaseCrudController;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends BaseController
{
    public function __construct()
    {
        $this->model = Category::class;
    }

    public function index()
    {
        $category= Category::where('is_active', 1)->orderBy('id','desc')->limit(10)->get();

            // return $this->get( $this->model);   
            return $this->success($category);

    }

    public function store(StoreCategoryRequest $request)
    {
            return $this->insert($this->model, $request->all());    
    }

    // /**
    //  * Display the specified resource.
    //  */
    public function show(Category $category)
    {
        if($category){
            return $this->get($category,null,"id",$category->id);
        }else {
            return response()->json(['error' => 'Category not found'], 404);        }
      
        
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
            return $this->edit($category, $request->all());
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

    public function search(Request $request){
        return $this->get( $this->model, null,'name',$request->key,null,null,null);
    } 
}
