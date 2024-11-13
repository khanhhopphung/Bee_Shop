<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\BaseController;
use App\Http\Requests\StoreReviewRequest;
use App\Http\Requests\UpdateReviewRequest;
use App\Models\Review;

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
            // Lấy tất cả các review mà không sử dụng điều kiện 'is_active'
            $reviews = Review::orderBy('id', 'desc')->get();
            return response()->json([
                "status" => "success",
                "data" => $reviews
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
    public function store(StoreReviewRequest $request)
    {
        try {
            // Thêm review mới
            $review = Review::create($request->all());
            return response()->json([
                "status" => "success",
                "data" => $review
            ], 201);
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
        try {
            return response()->json([
                "status" => "success",
                "data" => $review
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "An error occurred: " . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReviewRequest $request, Review $review)
    {
        try {
            $review->update($request->all());
            return response()->json([
                "status" => "success",
                "data" => $review
            ], 200);
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
        try {
            // Xóa mềm review
            $review->delete();
            return response()->json([
                "status" => "success",
                "message" => "Review deleted successfully."
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "An error occurred: " . $e->getMessage()
            ], 500);
        }
    }
}
