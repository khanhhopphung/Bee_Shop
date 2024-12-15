<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Promotion;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class StatisticsController extends Controller
{

    /**
     * Tổng quan dashboard
     */ public function dashboard(Request $request)
    {
        // Lấy giá trị start_date và end_date từ request
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        // Kiểm tra nếu có ngày được chọn
        if ($startDate && $endDate) {
            // Chuyển đổi chuỗi ngày thành Carbon instance
            try {
                $startDate = Carbon::parse($startDate)->startOfDay();
                $endDate = Carbon::parse($endDate)->endOfDay();
            } catch (\Exception $e) {
                return response()->json(['error' => 'Invalid date format.'], 400);
            }
        } else {
            // Nếu không chọn ngày, sử dụng từ trước đến nay
            $startDate = now()->subYear()->startOfDay();  // Bắt đầu từ một năm trước
            $endDate = now()->endOfDay();  // Kết thúc là ngày hiện tại
        }

        // Thực hiện thống kê theo khoảng thời gian đã chọn hoặc từ trước đến nay
        $totalRevenue = Order::whereBetween('order_date', [$startDate, $endDate])->sum('total_amount');
        $totalOrders = Order::whereBetween('order_date', [$startDate, $endDate])->count();
        $newCustomers = User::where('created_at', '>=', $startDate)->count(); // Khách hàng mới trong khoảng thời gian

        // Sản phẩm bán chạy
        $topSellingProducts = Order::join('order_details', 'orders.id', '=', 'order_details.order_id')
            ->join('products', 'order_details.product_id', '=', 'products.id')
            ->select('products.name', DB::raw('SUM(order_details.quantity) as total_sold'))
            ->groupBy('products.name')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->get();
        //tồn kho
        $lowStockProducts = Product::where('stock', '<', 10)
            ->select('id', 'name', 'sku', 'price', 'stock', 'category_id', 'is_active', 'created_at', 'updated_at')
            ->orderBy('stock', 'asc') 
            ->get();

        $lowStockCount = $lowStockProducts->count();

        $soldProducts = Order::join('order_details', 'orders.id', '=', 'order_details.order_id')
        ->join('products', 'order_details.product_id', '=', 'products.id')
        ->select('products.name', 'products.sku', DB::raw('SUM(order_details.quantity) as total_sold'), DB::raw('SUM(order_details.quantity * order_details.price) as total_revenue'))
        ->whereBetween('orders.order_date', [$startDate, $endDate])
        ->groupBy('products.id')
        ->orderByDesc('total_sold')
        ->get();

    

$lowStockCount = $lowStockProducts->count();

$unsoldProducts = Product::whereNotIn('id', function($query) use ($startDate, $endDate) {
    $query->select('product_id')
          ->from('order_details')
          ->join('orders', 'order_details.order_id', '=', 'orders.id')
          ->whereBetween('orders.order_date', [$startDate, $endDate]);
})->get();
  
        // Thống kê phương thức thanh toán
        $paymentMethodStats = Order::select('payment_method', DB::raw('count(*) as count'))
            ->groupBy('payment_method')
            ->get();

        // Thống kê khuyến mãi
        $promotionUsageStats = Promotion::join('orders', 'promotions.id', '=', 'orders.promotion_id')
            ->select('promotions.code', DB::raw('count(*) as usage_count'))
            ->groupBy('promotions.code')
            ->get();

        // Tăng trưởng doanh thu nhờ khuyến mãi
        $promotionRevenueGrowth = Order::whereNotNull('promotion_id')
            ->select(DB::raw('SUM(total_amount) as total_revenue'))
            ->first();

        // Thống kê vận chuyển
        $shippingStats = Order::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get();

            return response()->json([
                'total_revenue' => $totalRevenue,
                'sold_products' => $soldProducts,
                'total_orders' => $totalOrders,
                'new_customers' => $newCustomers,
                'top_selling_products' => $topSellingProducts,
                'low_stock_products' => [
                    'count' => $lowStockCount,
                    'products' => $lowStockProducts,
                ],
                'unsold_products' => $unsoldProducts,  // Thêm thống kê sản phẩm không bán được
                'payment_method_stats' => $paymentMethodStats,
                'promotion_usage_stats' => $promotionUsageStats,
                'promotion_revenue_growth' => $promotionRevenueGrowth,
                'shipping_stats' => $shippingStats,
            ]);
    }
}
