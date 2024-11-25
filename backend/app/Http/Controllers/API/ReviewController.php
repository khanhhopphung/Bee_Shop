<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\BaseController;
use App\Http\Requests\StoreReviewRequest;
use App\Http\Requests\UpdateReviewRequest;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;
use PhpParser\Node\Stmt\TryCatch;

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
        // Gán mặc định `user_id` và `product_id` hoặc xử lý theo yêu cầu
        $userId = 1; // Hoặc có thể là giá trị mặc định khác
        $productId = 1; // Bạn có thể sửa `product_id` theo yêu cầu của bạn

        // Tạo mới review
        $review = Review::create([
            'user_id' => $userId,
            'product_id' => $productId,
            'comment' => $request->comment,
            'rating' => $request->rating,
            'is_verified' => $request->is_verified ?? false,
            'review_date' => now(), // Thêm dòng này
        ]);

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
    public function show($productId)
{
    try {
        $reviews = Review::where('product_id', $productId)
            ->with('user:id,username') // Lấy username từ bảng users
            ->get();

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
     * Update the specified resource in storage.
     */
    public function update(UpdateReviewRequest $request, Review $review)
    {
        try {
            $review->update($request->validated());
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
    public function getAllReviewByProduct(string $productId)
{
    try {
        $product = Product::find($productId);
        if (!$product) {
            return response()->json([
                'message' => 'Product not found',
                'code' => 404,
            ], 404);
        }

        // Lấy tất cả đánh giá cùng với thông tin người dùng
        $reviews = $product->reviews()->with('user:id,username')->get();

        // Tính trung bình rating và số lượng đánh giá
        $totalRating = 0;
        $ratingCount = 0;

        foreach ($reviews as $review) {
            $totalRating += $review->rating;  // Tổng rating
            $ratingCount++;  // Đếm số lượng đánh giá
        }

        $averageRating = $ratingCount > 0 ? $totalRating / $ratingCount : 0;  // Tránh chia cho 0

        // Thêm trung bình rating và số lượng đánh giá vào kết quả trả về
        return response()->json([
            'message' => 'Success',
            'code' => 200,
            'data' => $reviews,
            'average_rating' => $averageRating,
            'rating_count' => $ratingCount,
        ], 200);

    } catch (\Exception $e) {
        // Xử lý ngoại lệ và trả về thông báo lỗi chi tiết
        return response()->json([
            'message' => $e->getMessage(),
            'code' => $e->getCode(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
        ], 500);
    }
}

    


}
