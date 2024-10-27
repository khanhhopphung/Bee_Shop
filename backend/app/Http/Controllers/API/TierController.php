<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\BaseController;
use App\Models\Tier;
use App\Http\Requests\StoreTierRequest;
use App\Http\Requests\UpdateTierRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;


class TierController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function __construct()
    {
        $this->model = Tier::class;
    }
    public function index()
    {
        try {
            return $this->get($this->model);
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "Đã xảy ra lỗi: " . $e->getMessage()
            ], 500);
        }
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
        try {
            return $this->insert($this->model, $request->all());
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "Đã xảy ra lỗi: " . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $tier = Tier::find($id);
            if (!$tier) {
                return response()->json([
                    "status" => "error",
                    "message" => "Không tìm thấy bản ghi với ID: " . $id
                ], 404);
            }
            return $this->get($tier, null, "id", $tier->id);
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "Đã xảy ra lỗi: " . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTierRequest $request, Tier $tier)
    {
        try {
            return $this->edit($tier, $request->all());
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "Đã xảy ra lỗi: " . $e->getMessage()
            ], 500);
        }
    }


    /**
     * Remove the specified resource from storage.
     */

    public function destroy($id)
    {
        try {

            return $this->delete(Tier::class, $id);
        } catch (ModelNotFoundException $e) {

            return response()->json([
                "status" => "error",
                "message" => "Không tìm thấy bản ghi với ID: " . $id,
            ], 404);
        } catch (\Exception $e) {

            return response()->json([
                "status" => "error",
                "message" => "Đã xảy ra lỗi: " . $e->getMessage(),
            ], 500);
        }
    }
}
