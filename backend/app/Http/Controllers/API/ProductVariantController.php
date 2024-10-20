<?php

namespace App\Http\Controllers\API;

use App\Models\ProductVarian;
use App\Http\Requests\StoreProductVariantRequest;
use App\Http\Requests\UpdateProductVariantRequest;
use App\Models\ProductVariant;
use Illuminate\Routing\Controller;

class ProductVariantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $productvariant = ProductVariant::where('is_active', true)->latest("id")->get();
            if ($productvariant->isEmpty()) {
                return response()->json([
                    "status" => "error",
                    "message" => "No active productvarian found."
                ], 404);
            }
            return response()->json([
                "status" => "success",
                "datas" => $productvariant,
                "total" => $productvariant->count()
            ], 200);
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
            $productvariants = ProductVariant::create($request->all());
                    return response()->json([
                    "status" => "success",
                    "message" => "them thanh cong",
                    "datas" => $productvariants
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
    public function show(ProductVariant $productVariant)
    {
        if ($productVariant->is_active==true) {
            return response()-> json ([
                "status" => "success",
                "datas"=> $productVariant
            ],200);
        }
        else if ($productVariant->is_active==false) {
            return response()->json([
                "status" => "error",
                "message" => "The productvariant is not active.",
                "datas"=> $productVariant
            ], 200);
        }
    } 
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductVariant $productVariant)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductVariantRequest $request, ProductVariant $productVariant)
    {
        try {
            $productVariant->update($request->all());
                    return response()->json([
                    "status" => "success",
                    "message" => "update thanh cong",
                    "datas" => $productVariant
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
    public function destroy(ProductVariant $productVariant)
    {
        $productVariant -> update (["is_active"=>false]);
        return response()->json([
            "status" => "success",
            "message" => "Product update successfully.",
            "datas" => $productVariant
        ], 200);

    }
}
