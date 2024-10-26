<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\BaseController;
use App\Http\Controllers\BaseCrudController;
use App\Http\Requests\StoreProductVariantRequest;
use App\Http\Requests\UpdateProductVariantRequest;
use App\Models\ProductVariant;
use Illuminate\Routing\Controller;

class ProductVariantController extends BaseController
{
    public function __construct()
    {
        $this->model = ProductVariant::class;
    }
    public function index()
    {
       
            return $this->get( $this->model);

    }
    

   
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductVariantRequest $request)
    {

            return $this->insert($this->model, $request->all());

    }

    /**
     * Display the specified resource.
     */
    public function show(ProductVariant $productVariant)
    {
       
            return $this->get($productVariant,null,"id",$productVariant->id);

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
            return $this->edit($productVariant, $request->all());

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
