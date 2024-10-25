<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\BaseController;
use App\Http\Requests\StoreReviewRequest;
use App\Http\Requests\UpdateReviewRequest;
use App\Models\Review;
use Illuminate\Support\Facades\Auth;

class ReviewController extends BaseController
{
    public function __construct()
    {
        $this->model = Review::class;
    }

    /**
     * Display a listing of the resource.
     */
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

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReviewRequest $request)
    {
        if (!Auth::check()) {
            return response()->json([
                "status" => "error",
                "message" => "You must be logged in to leave a review."
            ], 403);
        }

        // Kiểm tra xem người dùng đã mua hàng hay chưa (giả định có phương thức để kiểm tra)
        $userId = Auth::id();
        $hasPurchased = $this->checkIfUserHasPurchased($userId, $request->product_id);

        if (!$hasPurchased) {
            return response()->json([
                "status" => "error",
                "message" => "You must purchase the product before leaving a review."
            ], 403);
        }

        try {
            return $this->insert($this->model, $request->all());
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "An error occurred: " . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Review $review)
    {
        return $this->get($review);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReviewRequest $request, Review $review)
    {
        try {
            return $this->edit($review, $request->all());
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "An error occurred: " . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Review $review)
    {
        return $this->edit($review, ['is_active' => false, 'deleted_at' => now()]);
    }

    private function checkIfUserHasPurchased($userId, $productId)
    {
        // Logic kiểm tra xem người dùng đã mua sản phẩm chưa
        // Giả định bạn có một model Order và có thể kiểm tra từ đó
        return \App\Models\Order::where('user_id', $userId)->whereHas('orderItems', function ($query) use ($productId) {
            $query->where('product_id', $productId);
        })->exists();
    }
}
