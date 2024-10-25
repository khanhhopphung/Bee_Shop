<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\BaseController;
use App\Http\Controllers\BaseCrudController;
use App\Models\Product;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use Illuminate\Routing\Controller;

class ProductController extends BaseController
{
    public function __construct()
    {
        $this->model = Product::class;
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


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
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

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        if ($product -> is_active == true) {
          return $this->get($product,null,"id",$product->id);
        }
        else if ($product -> is_active ==false) {
            return response()->json([
                "status" => "error",
                "message" => "This product is not active.",
                "datas" => $product
            ], 200);
        }
    }

  
//     /**
//      * Update the specified resource in storage.
//      */
    public function update(UpdateProductRequest $request, Product $product)
    {
        try {
            return $this->edit($product, $request->all());
        }
        catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "An error occurred: " . $e->getMessage()."Code :".$e->getCode() ."line:".$e->getLine(),

            ], 500);

        }
    }

//     /**
//      * Remove the specified resource from storage.
//      */
    public function destroy(Product $product)
    {
        $data = [
            "is_active" => false,
            "deleted_at" => date('Y-m-d H:i:s')
        ];
        return $this->edit($product, $data );
        
    }
}
