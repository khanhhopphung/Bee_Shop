<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\BaseController;
use App\Http\Requests\StorePromotionRequest;
use App\Http\Requests\UpdatePromotionRequest;
use App\Models\Promotion;
use Carbon\Carbon;

class PromotionController extends BaseController
{
    public function __construct()
    {
        $this->model = Promotion::class;
    }

    public function index()
    {
        try {
            return $this->get($this->model);
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "An error occurred: " . $e->getMessage()
            ], 500);
        }
    }

    public function store(StorePromotionRequest $request)
    {
        try {
            $data = $request->all();
            // Format start_date and end_date
            $data['start_date'] = Carbon::parse($data['start_date'])->format('Y-m-d H:i:s');
            $data['end_date'] = Carbon::parse($data['end_date'])->format('Y-m-d H:i:s');

            return $this->insert($this->model, $data);
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "An error occurred: " . $e->getMessage(),
            ], 500);
        }
    }

    public function show(Promotion $promotion)
    {
        if ($promotion->is_active == true) {
            return $this->get($promotion, null, "id", $promotion->id);
        } else {
            return response()->json([
                "status" => "error",
                "message" => "This promotion is not active.",
                "data" => $promotion
            ], 200);
        }
    }

    public function update(UpdatePromotionRequest $request, Promotion $promotion)
    {
        try {
            $data = $request->all();
            // Format start_date and end_date if present
            if (isset($data['start_date'])) {
                $data['start_date'] = Carbon::parse($data['start_date'])->format('Y-m-d H:i:s');
            }
            if (isset($data['end_date'])) {
                $data['end_date'] = Carbon::parse($data['end_date'])->format('Y-m-d H:i:s');
            }

            return $this->edit($promotion, $data);
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "An error occurred: " . $e->getMessage() . " Code: " . $e->getCode() . " Line: " . $e->getLine(),
            ], 500);
        }
    }

    public function destroy(Promotion $promotion)
    {
        $data = [
            "is_active" => false,
            "deleted_at" => date('Y-m-d H:i:s')
        ];
        return $this->edit($promotion, $data);
    }
}