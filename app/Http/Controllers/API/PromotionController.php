<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Promotion;
use App\Http\Requests\StorePromotionRequest;
use App\Http\Requests\UpdatePromotionRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

class PromotionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $promotions = Promotion::all();

        return response()->json([
            'message' => 'danh sach promotions . ' . request('page', 1),
            'data' => $promotions
        ]);
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
    public function store(StorePromotionRequest $request)
    {
        $promotions = Promotion::query()->create($request->all());
        
        return response()->json([
            'message' => 'Tao moi thanh cong khuyến mãi',
            'data' => $promotions
        ], HttpResponse::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $promotions = Promotion::query()->findOrFail($id);

            return response()->json([
                'message' => 'Chi tiết promotion id = ' . $id,
                'data' => $promotions
            ]);
        } catch (\Throwable $th) {
            if ($th instanceof ModelNotFoundException){
                return response()->json([
                    'message' => 'Khong tim thay promotion co id = ' . $id,
                ], HttpResponse::HTTP_NOT_FOUND);
            }

            return response()->json([
                'message' => 'Khong tim thay promotion co id = ' . $id,
            ], HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Promotion $promotion)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $promotions = Promotion::query()->findOrFail($id);

        $promotions->update(request()->all());

        return response()->json($promotions);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $promotions = Promotion::findOrFail($id);
            $promotions->delete(); 
    
            return response()->json([
                'message' => 'Xóa thành công promotion với ID = ' . $id,
            ], HttpResponse::HTTP_OK);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Không tìm thấy promotion với ID = ' . $id,
            ], HttpResponse::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi xóa promotion: ' . $e->getMessage(),
            ], HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

    }
}
