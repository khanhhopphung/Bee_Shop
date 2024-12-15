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
    public function dashboard(Request $request)
    {
        // Lấy giá trị start_date, end_date, year và month từ request
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $selectedYear = $request->input('year');
        $selectedMonth = $request->input('month');
    
        // Kiểm tra nếu có ngày được chọn
        if ($startDate && $endDate) {
            try {
                $startDate = Carbon::parse($startDate)->startOfDay();
                $endDate = Carbon::parse($endDate)->endOfDay();
            } catch (\Exception $e) {
                return response()->json(['error' => 'Invalid date format.'], 400);
            }
        } else {
            $startDate = now()->subYear()->startOfDay();  // Bắt đầu từ một năm trước
            $endDate = now()->endOfDay();  // Kết thúc là ngày hiện tại
        }
    
        // Nếu có năm được chọn, thay đổi khoảng thời gian để thống kê
        if ($selectedYear) {
            $startDate = Carbon::createFromDate($selectedYear, 1, 1)->startOfDay();
            $endDate = Carbon::createFromDate($selectedYear, 12, 31)->endOfDay();
        }
    
        // Nếu có tháng được chọn, thay đổi khoảng thời gian để thống kê
        if ($selectedMonth) {
            $startDate = Carbon::createFromDate($selectedYear ?? now()->year, $selectedMonth, 1)->startOfDay();
            $endDate = Carbon::createFromDate($selectedYear ?? now()->year, $selectedMonth, 1)->endOfMonth()->endOfDay();
        }
    
        // Thực hiện thống kê theo khoảng thời gian đã chọn
        $totalRevenue = Order::whereBetween('order_date', [$startDate, $endDate])->sum('total_amount');
        $totalOrders = Order::whereBetween('order_date', [$startDate, $endDate])->count();
        $newCustomers = User::where('created_at', '>=', $startDate)->count(); // Khách hàng mới trong khoảng thời gian

        // Sản phẩm bán chạy
        $topSellingProducts = Order::join('order_details', 'orders.id', '=', 'order_details.order_id')
            ->join('products', 'order_details.product_id', '=', 'products.id')
            ->select('products.name', DB::raw('SUM(order_details.quantity) as total_sold'))
            ->whereBetween('orders.order_date', [$startDate, $endDate])
            ->groupBy('products.id', 'products.name')
            ->having('total_sold', '>', 5) 
            ->orderByDesc('total_sold')
            ->limit(10)
            ->get();

        // Tồn kho
        $lowStockProducts = Product::where('stock', '<', 5)
            ->select('id', 'name', 'sku', 'price', 'stock', 'category_id', 'is_active', 'created_at', 'updated_at')
            ->orderBy('stock', 'asc')
            ->get();

        // Tính số lượng sản phẩm tồn kho thấp
        $lowStockCount = $lowStockProducts->count();

        // Sản phẩm đã bán được
        $soldProducts = Order::join('order_details', 'orders.id', '=', 'order_details.order_id')
            ->join('products', 'order_details.product_id', '=', 'products.id')
            ->select('products.name', 'products.sku', DB::raw('SUM(order_details.quantity) as total_sold'), DB::raw('SUM(order_details.quantity * order_details.price) as total_revenue'))
            ->whereBetween('orders.order_date', [$startDate, $endDate])
            ->groupBy('products.id', 'products.name', 'products.sku')
            ->orderByDesc('total_sold')
            ->get();

        // Tất cả sản phẩm đã bán được (không phân loại)
        $allSoldProducts = Order::join('order_details', 'orders.id', '=', 'order_details.order_id')
            ->join('products', 'order_details.product_id', '=', 'products.id')
            ->select('products.id', 'products.name', 'products.sku', DB::raw('SUM(order_details.quantity) as total_sold'), DB::raw('SUM(order_details.quantity * order_details.price) as total_revenue'))
            ->whereBetween('orders.order_date', [$startDate, $endDate])
            ->groupBy('products.id', 'products.name', 'products.sku')
            ->get();

        // Thống kê phương thức thanh toán
        $paymentMethodStats = Order::select('payment_method', DB::raw('count(*) as count'))
            ->whereBetween('order_date', [$startDate, $endDate])
            ->groupBy('payment_method')
            ->get();
    
        // Thống kê khuyến mãi
        $promotionUsageStats = Promotion::leftJoin('orders', 'promotions.id', '=', 'orders.promotion_id')
            ->select('promotions.code', DB::raw('count(orders.id) as usage_count'))
            ->where(function ($query) use ($startDate, $endDate) {
                $query->whereBetween('orders.order_date', [$startDate, $endDate])
                      ->orWhereNull('orders.order_date');
            })
            ->groupBy('promotions.code')
            ->get();
    
        // Tăng trưởng doanh thu nhờ khuyến mãi
        $promotionRevenueGrowth = Order::whereNotNull('promotion_id')
            ->whereBetween('order_date', [$startDate, $endDate])
            ->select(DB::raw('SUM(total_amount) as total_revenue'))
            ->first();
    
        // Thống kê vận chuyển
        $shippingStats = Order::select('status', DB::raw('count(*) as count'))
            ->whereBetween('order_date', [$startDate, $endDate])
            ->groupBy('status')
            ->get();
    
        return response()->json([
            'total_revenue' => $totalRevenue,
            'sold_products' => $soldProducts,
            'all_sold_products' => $allSoldProducts, // Thêm biến mới
            'total_orders' => $totalOrders,
            'new_customers' => $newCustomers,
            'top_selling_products' => $topSellingProducts,
            'low_stock_products' => [
                'count' => $lowStockCount,
                'products' => $lowStockProducts,
            ],
            'payment_method_stats' => $paymentMethodStats,
            'promotion_usage_stats' => $promotionUsageStats,
            'promotion_revenue_growth' => $promotionRevenueGrowth,
            'shipping_stats' => $shippingStats,
        ]);
    }
}