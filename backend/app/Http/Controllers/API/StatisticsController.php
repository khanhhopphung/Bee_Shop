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
->whereBetween('orders.order_date', [$startDate, $endDate]) // Thêm điều kiện ngày
->groupBy('products.id', 'products.name')
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

    
        $soldProducts = Order::join('order_details', 'orders.id', '=', 'order_details.order_id')
            ->join('products', 'order_details.product_id', '=', 'products.id')
            ->select('products.name', 'products.sku', DB::raw('SUM(order_details.quantity) as total_sold'), DB::raw('SUM(order_details.quantity * order_details.price) as total_revenue'))
            ->whereBetween('orders.order_date', [$startDate, $endDate]) // Thêm điều kiện ngày
            ->groupBy('products.id', 'products.name', 'products.sku')
            ->orderByDesc('total_sold')
            ->get();
    
        $unsoldProducts = Product::whereNotIn('products.id', function($query) use ($startDate, $endDate) {
            $query->select('order_details.product_id')
                  ->from('order_details')
                  ->join('orders', 'order_details.order_id', '=', 'orders.id')
                  ->whereBetween('orders.order_date', [$startDate, $endDate]);
        })->get();
      

        
        // Thống kê phương thức thanh toán
        $paymentMethodStats = Order::select('payment_method', DB::raw('count(*) as count'))
            ->whereBetween('order_date', [$startDate, $endDate]) // Thêm điều kiện ngày
            ->groupBy('payment_method')
            ->get();
    
        // Thống kê khuyến mãi
        $promotionUsageStats = Promotion::join('orders', 'promotions.id', '=', 'orders.promotion_id')
            ->select('promotions.code', DB::raw('count(*) as usage_count'))
            ->whereBetween('orders.order_date', [$startDate, $endDate]) // Thêm điều kiện ngày
            ->groupBy('promotions.code')
            ->get();
    
        // Tăng trưởng doanh thu nhờ khuyến mãi
        $promotionRevenueGrowth = Order::whereNotNull('promotion_id')
            ->whereBetween('order_date', [$startDate, $endDate]) // Thêm điều kiện ngày
            ->select(DB::raw('SUM(total_amount) as total_revenue'))
            ->first();
    
        // Thống kê vận chuyển
        $shippingStats = Order::select('status', DB::raw('count(*) as count'))
            ->whereBetween('order_date', [$startDate, $endDate]) // Thêm điều kiện ngày
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
            'unsold_products' => $unsoldProducts,
            'payment_method_stats' => $paymentMethodStats,
            'promotion_usage_stats' => $promotionUsageStats,
            'promotion_revenue_growth' => $promotionRevenueGrowth,
            'shipping_stats' => $shippingStats,
            
        ]);
    }
}
