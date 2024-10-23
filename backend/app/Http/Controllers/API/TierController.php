<?php

namespace App\Http\Controllers\API;

use App\Models\Tier;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTierRequest;
use App\Http\Requests\UpdateTierRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

class TierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tiers = Tier::all();

        return response()->json([
            "status" => "success",
            'message' => 'danh sach tiers . ' . request('page', 1),
            'data' => $tiers
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
    public function store(StoreTierRequest $request)
    {
        $tiers = Tier::query()->create($request->all());
        return response()->json([
            "status" => "success",
            'message' => 'Tao moi thanh cong người dung',
            'data' => $tiers
        ], HttpResponse::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $tiers = Tier::query()->findOrFail($id);

            return response()->json([
                "status" => "success",
                'message' => 'Chi tiết tier id = ' . $id,
                'data' => $tiers
            ]);
        } catch (\Throwable $th) {
            if ($th instanceof ModelNotFoundException) {
                return response()->json([
                    "status" => "errors",
                    'message' => 'Khong tim thay tier co id = ' . $id,
                ], HttpResponse::HTTP_NOT_FOUND);
            }

            return response()->json([
                'message' => 'Khong tim thay tier co id = ' . $id,
            ], HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Tier $tier)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {

            $tier = Tier::query()->findOrFail($id);

            $tier->update($request->all());
            return response()->json([
                "status" => "success",
                'message' => 'Cập nhật tier thành công',
                'data' => $tier
            ], HttpResponse::HTTP_OK);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                "status" => "error",
                'message' => 'Không tìm thấy tier với ID = ' . $id,
            ], HttpResponse::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                'message' => 'Lỗi khi cập nhật tier: ' . $e->getMessage(),
            ], HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {

        try {
            $tiers = Tier::findOrFail($id);
            $tiers->delete();

            return response()->json([
                "status" => "success",
                'message' => 'Xóa thành công tier với ID = ' . $id,
            ], HttpResponse::HTTP_OK);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                "status" => "errors",
                'message' => 'Không tìm thấy tier với ID = ' . $id,
            ], HttpResponse::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return response()->json([
                "status" => "errors",
                'message' => 'Lỗi khi xóa tier: ' . $e->getMessage(),
            ], HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
