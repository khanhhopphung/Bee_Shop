<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
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
        $totalRevenue = Order::where('status', 'completed')
            ->whereBetween('order_date', [$startDate, $endDate])
            ->sum('total_amount');

        $totalOrders = Order::whereBetween('order_date', [$startDate, $endDate])
            ->where('status', '=', 'completed')
            ->count();

        // Thống kê tất cả sản phẩm
        $allProducts = Product::select(
            'products.id',
            'products.name',
            'products.sku',
            'product_variants.price',
            'product_variants.stock',
            'sizes.size_name as size_name',
            'colors.color_name as color_name'
        )
            ->join('product_variants', 'products.id', '=', 'product_variants.product_id')
            ->join('sizes', 'product_variants.size_id', '=', 'sizes.id')
            ->join('colors', 'product_variants.color_id', '=', 'colors.id')
            ->get();




        // Sản phẩm bán chạy
        $topSellingProducts = Order::join('order_details', 'orders.id', '=', 'order_details.order_id')
            ->join('products', 'order_details.product_id', '=', 'products.id')
            ->select('products.name', DB::raw('SUM(order_details.quantity) as total_sold'))
            ->whereBetween('orders.order_date', [$startDate, $endDate])
            ->groupBy('products.id', 'products.name')
            ->where('orders.status', '=', 'completed')
            ->having('total_sold', '>=', 1)
            ->orderByDesc('total_sold')
            ->limit(10)
            ->get();



        // Tồn kho
        $lowStockProducts = ProductVariant::select(
            'product_variants.id',
            'products.name as product_name',
            'sizes.size_name as size_name',
            'colors.color_name as color_name',
            'product_variants.price',
            'product_variants.stock',
            'product_variants.is_active',
            'product_variants.created_at',
            'product_variants.updated_at'
        )
            ->join('products', 'product_variants.product_id', '=', 'products.id')
            ->join('sizes', 'product_variants.size_id', '=', 'sizes.id')
            ->join('colors', 'product_variants.color_id', '=', 'colors.id')
            ->where('product_variants.stock', '<', 10)
            ->orderBy('product_variants.stock', 'asc')
            ->get();

        // Đếm số lượng
        $lowStockCount = $lowStockProducts->count();

        // Thống kê tài khoản người dùng
        $totalUsers = User::count();

        // Sản phẩm đã bán được
        $soldProducts = Order::join('order_details', 'orders.id', '=', 'order_details.order_id')
            ->join('products', 'order_details.product_id', '=', 'products.id')
            ->select('products.name', 'products.sku', DB::raw('SUM(order_details.quantity) as total_sold'), DB::raw('SUM(order_details.quantity * order_details.price) as total_revenue'))
            ->whereBetween('orders.order_date', [$startDate, $endDate])
            ->where('orders.status', '=', 'completed')
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

        // Ánh xạ tên hiển thị
        $statusLabels = [
            'completed' => 'Đơn hàng đã hoàn thành',
            'pending' => 'Đơn hàng đang chờ',
            'cancelled' => 'Đơn hàng bị hủy',
            'returned' => 'Đơn hàng đã trả',
            'shipped' => ' đang vận chuyển',
            'delivered' => 'đang giao hàng',
            'refunded' => 'đã hoàn lại',

            // Thêm bất kỳ trạng thái nào khác bạn muốn ánh xạ
        ];

        // Thay đổi tên hiển thị trong kết quả
        $shippingStats->transform(function ($item) use ($statusLabels) {
            $item->status = $statusLabels[$item->status] ?? $item->status; // Sử dụng tên hiển thị mới hoặc giữ nguyên nếu không có ánh xạ
            return $item;
        });
        // Thống kê đơn hàng trong khoảng thời gian đã chọn
        $totalOrders = Order::whereBetween('order_date', [$startDate, $endDate])->count();
        $successfulOrders = Order::where('status', 'completed')->whereBetween('order_date', [$startDate, $endDate])->count();
        $canceledOrders = Order::where('status', 'cancelled')->whereBetween('order_date', [$startDate, $endDate])->count();
        $returnedOrders = Order::where('status', 'returned')->whereBetween('order_date', [$startDate, $endDate])->count();

        // Tính tỉ lệ
        $successRate = $totalOrders > 0 ? ($successfulOrders / $totalOrders) * 100 : 0;
        $cancellationRate = $totalOrders > 0 ? ($canceledOrders / $totalOrders) * 100 : 0;
        $returnRate = $totalOrders > 0 ? ($returnedOrders / $totalOrders) * 100 : 0;

        // Tồn kho nhieu
        $lowStockProductsNhieu = ProductVariant::select(
            'product_variants.id',
            'products.name as product_name',
            'sizes.size_name as size_name',
            'colors.color_name as color_name',
            'product_variants.price',
            'product_variants.stock',
            'product_variants.is_active',
            'product_variants.created_at',
            'product_variants.updated_at'
        )
            ->join('products', 'product_variants.product_id', '=', 'products.id')
            ->join('sizes', 'product_variants.size_id', '=', 'sizes.id')
            ->join('colors', 'product_variants.color_id', '=', 'colors.id')
            ->where('product_variants.stock', '>', 100)
            ->orderBy('product_variants.stock', 'asc')
            ->get();
        // Đếm số lượng
        $lowStockCountNhieu = $lowStockProductsNhieu->count();


        return response()->json([
            'low_stock_products_nhieu' => [
                'count' => $lowStockCountNhieu,
                'products' => $lowStockProductsNhieu,
            ],
            'all_products' => $allProducts,
            'total_revenue' => $totalRevenue,
            'sold_products' => $soldProducts,
            'all_sold_products' => $allSoldProducts,
            'total_orders' => $totalOrders,
            'top_selling_products' => $topSellingProducts,
            'low_stock_products' => [
                'count' => $lowStockCount,
                'products' => $lowStockProducts,
            ],
            'payment_method_stats' => $paymentMethodStats,
            'promotion_usage_stats' => $promotionUsageStats,
            'promotion_revenue_growth' => $promotionRevenueGrowth,
            'shipping_stats' => $shippingStats,
            'total_users' => $totalUsers,
            'success_rate' => $successRate,
            'cancellation_rate' => $cancellationRate,
            'return_rate' => $returnRate,
        ]);
    }
}
