<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\CartDetail;
use App\Http\Requests\StoreCartDetailRequest;
use App\Http\Requests\UpdateCartDetailRequest;
use Illuminate\Http\Request;

class CartDetailController extends Controller
{
    public function cartDetailOrder(Request $request) {
        try{
        $ids = $request->ids;
    
        // Load quan hệ 'products' và 'image' của sản phẩm để tối ưu hóa truy vấn
        $cartDetails = CartDetail::whereIn("id", $ids)
            ->with(['product.image', 'productVariant.color','productVariant.size']) // đảm bảo bạn đã khai báo quan hệ này
            ->get();
    
        // $response = $cartDetails->map(function ($cartDetail) {
        //     return [
        //         'id' => $cartDetail->id,
        //         'products' => [
        //             'id' => $cartDetail->product->id ?? null,
        //             'name' => $cartDetail->product->name ?? null,
        //             'image' => $cartDetail->product->image->image_url ?? null, // Lấy URL hình ảnh
        //         ],
        //         'color' => $cartDetail->productVariant->color->name ?? null,
        //         'size' => $cartDetail->productVariant->size->name ?? null,
        //     ];
        // });
    
        return response()->json([
            'cart_details' =>  $cartDetails,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'mes'=> $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
        ], 400);
    }
}

    
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCartDetailRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(CartDetail $cartDetail)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CartDetail $cartDetail)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCartDetailRequest $request, CartDetail $cartDetail)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CartDetail $cartDetail)
    {
        //
    }
}
