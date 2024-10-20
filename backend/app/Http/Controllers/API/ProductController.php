<?php

namespace App\Http\Controllers\API;

use App\Models\Product;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use Illuminate\Routing\Controller;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $products = Product::where('is_active', true)->latest("id")->get();
            if ($products->isEmpty()) {
                return response()->json([
                    "status" => "error",
                    "message" => "No active products found."
                ], 404);
            }
            return response()->json([
                "status" => "success",
                "datas" => $products,
                "total" => $products->count()
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
    public function store(StoreProductRequest $request)
    {
        try {
            $products = Product::create($request->all());
                    return response()->json([
                    "status" => "success",
                    "message" => "them thanh cong",
                    "datas" => $products
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
    public function show(Product $product)
    {
        if ($product -> is_active == true) {
            return response()-> json ([
                "status" => "success",
                "datas"=> $product

            ],200);
        }
        else if ($product -> is_active ==false) {
            return response()->json([
                "status" => "error",
                "message" => "This product is not active.",
                "datas" => $product
            ], 200);
        }
    }

  
    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        try {
            $product->update($request->all());
                    return response()->json([
                    "status" => "success",
                    "message" => "update thanh cong",
                    "datas" => $product
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
    public function destroy(Product $product)
    {
        $product -> update(["is_active" => false]);
        return response()->json([
            "status" => "success",
            "message" => "Product update successfully.",
            "datas" => $product
        ], 200);
    }
}
