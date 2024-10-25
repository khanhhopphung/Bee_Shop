<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\BaseController;
use App\Http\Controllers\BaseCrudController;
use App\Models\ProductVariant;
use App\Http\Requests\StoreProductVariantRequest;
use App\Http\Requests\UpdateProductVariantRequest;
use Illuminate\Routing\Controller;

class ProductVariantController extends BaseController
{
    public function __construct()
    {
        $this->model = ProductVariant::class;
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
    public function store(StoreProductVariantRequest $request)
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
    public function show(ProductVariant $productVariant)
    {
        if ($productVariant -> is_active == true) {
            return $this->get($productVariant,null,"id",$productVariant->id);
          }
          else if ($productVariant -> is_active ==false) {
              return response()->json([
                  "status" => "error",
                  "message" => "This productvariant is not active.",
                  "datas" => $productVariant
              ], 200);
          }
    } 
//     /**
//      * Show the form for editing the specified resource.
//      */
    // public function edit(ProductVariant $productVariant)
    // {
    //     //
    // }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductVariantRequest $request, ProductVariant $productVariant)
    {
        try {
            return $this->edit($productVariant, $request->all());
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
    public function destroy(ProductVariant $productVariant)
    {
        $data = [
            "is_active" => false,
            "deleted_at" => date('Y-m-d H:i:s')
        ];
        return $this->edit($productVariant, $data );
        
    }
}
