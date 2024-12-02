<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\BaseController;
use App\Http\Controllers\BaseCrudController;
use App\Models\Product;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Category;
use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Http\Response as HttpResponse;
use Throwable;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

use Illuminate\Support\Facades\Storage;

use function PHPSTORM_META\map;

class ProductController extends BaseController
{
    public function __construct()
    {
        $this->model = Product::class;
    }
    public function getVariants($id)
{
    try {
        // Kiểm tra sản phẩm tồn tại
        $product = Product::findOrFail($id);

        // Lấy biến thể của sản phẩm
        $productVariants = $product->productVariants; 
       
        return response()->json([
            'success' => true,
            'data' => $productVariants,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Không thể lấy biến thể sản phẩm.',
        ], 500);
    }
}

    public function bestProduct()
{
    $bestSellingProducts = DB::table('products')
        ->join('order_details', 'products.id', '=', 'order_details.product_id')
        ->leftJoin('product_variants', 'products.id', '=', 'product_variants.product_id') // Join với bảng product_variants
        ->leftJoin('images', function ($join) {
            $join->on('products.id', '=', 'images.product_id') // Join với images
                 ->whereNull('images.variant_id'); // Điều kiện variant_id trong bảng images phải là NULL
        })
        ->select(
            'products.id',
            'products.name',
            'products.price',
            DB::raw('SUM(order_details.quantity) as total_sold'),
            'images.image_url', // Lấy image_url từ bảng images
            'images.alt_text', // Lấy alt_text từ bảng images
            DB::raw('MAX(product_variants.price) as price_max'), // Giá cao nhất của product_variants
            DB::raw('MIN(product_variants.price) as price_min'), // Giá thấp nhất của product_variants
            DB::raw('SUM(product_variants.stock) as stock') // Tổng số lượng tồn kho từ product_variants
        )
        ->whereNotNull('product_variants.id') // Lọc các sản phẩm có biến thể
        ->groupBy('products.id', 'products.name', 'products.price', 'images.image_url', 'images.alt_text')
        ->orderByDesc('total_sold')
        ->limit(12)
        ->get();

    return $this->success($bestSellingProducts);
}


    public function badProduct()
    {
        // Lấy sản phẩm bán chậm với image_url và tất cả biến thể
        $slowSellingProducts = DB::table('products')
            ->leftJoin('order_details', 'products.id', '=', 'order_details.product_id')
            ->leftJoin('images', 'products.id', '=', 'images.product_id')
            ->leftJoin('product_variants', 'products.id', '=', 'product_variants.product_id')
            ->select(
                'products.id',
                'products.name',
                // 'products.price',
                DB::raw('COALESCE(SUM(order_details.quantity), 0) as total_sold'),
                DB::raw('SUM(product_variants.stock) as stock'),
                DB::raw('MAX(product_variants.price) as price_max'),
                DB::raw('MIN(product_variants.price) as price_min'),
                // 'products.stock',
                'images.image_url',
                'images.alt_text'
            )
            ->whereNotNull('product_variants.id')
            ->groupBy('products.id', 'products.name', 'images.image_url', 'images.alt_text')
            ->orderBy('total_sold', 'asc')
            ->limit(10)
            ->get();

        // Lấy các biến thể liên kết với mỗi sản phẩm bán chậm
        foreach ($slowSellingProducts as $product) {
            $product->variants = DB::table('product_variants')
                ->where('product_id', $product->id)
                ->get();
        }

        // Lấy các sản phẩm tồn kho cao
        $highStockProducts = DB::table('products')
            ->leftJoin('images', 'products.id', '=', 'images.product_id')
            ->leftJoin('product_variants', 'products.id', '=', 'product_variants.product_id')
            ->select(
                'products.id',
                'products.name',
                // 'products.price',
                'images.image_url',
                'images.alt_text',
                DB::raw('SUM(product_variants.stock) as stock'),
                DB::raw('MAX(product_variants.price) as price_max'),
                DB::raw('MIN(product_variants.price) as price_min'),
            )
            ->whereNotNull('product_variants.id')
            ->where('products.stock', '>', 0)
            ->groupBy('products.id', 'products.name', 'images.image_url', 'images.alt_text')
            ->orderBy('products.stock', 'desc')
            ->limit(10)
            ->get();

        // Lấy các biến thể liên kết với mỗi sản phẩm tồn kho cao
        foreach ($highStockProducts as $product) {
            $product->variants = DB::table('product_variants')
                ->where('product_id', $product->id)
                ->get();
        }

        // Trộn hai mảng sản phẩm lại xen kẽ
        $combinedProducts = [];
        $existingProductIds = [];  // Mảng để theo dõi các ID sản phẩm đã thêm

        $slowSellingProducts = $slowSellingProducts->toArray();
        $highStockProducts = $highStockProducts->toArray();

        $maxLength = max(count($slowSellingProducts), count($highStockProducts));

        for ($i = 0; $i < $maxLength; $i++) {
            if (isset($slowSellingProducts[$i])) {
                // Kiểm tra nếu sản phẩm chưa có trong mảng kết hợp
                if (!in_array($slowSellingProducts[$i]->id, $existingProductIds)) {
                    $combinedProducts[] = $slowSellingProducts[$i];
                    $existingProductIds[] = $slowSellingProducts[$i]->id;
                }
            }
            if (isset($highStockProducts[$i])) {
                // Kiểm tra nếu sản phẩm chưa có trong mảng kết hợp
                if (!in_array($highStockProducts[$i]->id, $existingProductIds)) {
                    $combinedProducts[] = $highStockProducts[$i];
                    $existingProductIds[] = $highStockProducts[$i]->id;
                }
            }
        }

        // Trả kết quả
        return $this->success($combinedProducts);
    }


    //     public function badProduct1()
    // {
    //     // Lấy sản phẩm bán chậm với image_url và tất cả biến thể
    //     $slowSellingProducts = DB::table('products')
    //         ->leftJoin('order_details', 'products.id', '=', 'order_details.product_id')
    //         ->leftJoin('images', 'products.id', '=', 'images.product_id')  // Lấy ảnh của sản phẩm
    //         ->leftJoin('product_variants', 'products.id', '=', 'product_variants.product_id')
    //         ->leftJoin('images as variant_images', 'product_variants.id', '=', 'variant_images.variant_id') // Lấy ảnh của biến thể từ bảng images
    //         ->select(
    //             'products.id',
    //             'products.name',
    //             DB::raw('COALESCE(SUM(order_details.quantity), 0) as total_sold'),
    //             DB::raw('SUM(product_variants.stock) as stock'), // Tổng tồn kho các biến thể
    //             DB::raw('MAX(product_variants.price) as price_max'),
    //             DB::raw('MIN(product_variants.price) as price_min'),
    //             'images.image_url as product_image_url', // Ảnh của sản phẩm
    //             'images.alt_text as product_alt_text',
    //             // 'variant_images.image_url as variant_image_url', // Ảnh của biến thể
    //             // 'variant_images.alt_text as variant_alt_text'
    //         )
    //         ->whereNotNull('product_variants.id') // Lọc sản phẩm không có biến thể
    //         ->groupBy('products.id', 'products.name', 'images.image_url', 'images.alt_text', 'variant_images.image_url', 'variant_images.alt_text')
    //         ->orderBy('total_sold', 'asc')
    //         ->limit(10)
    //         ->get();

    //     // Lấy các biến thể liên kết với mỗi sản phẩm bán chậm
    //     foreach ($slowSellingProducts as $product) {
    //         $product->variants = DB::table('product_variants')
    //             ->leftJoin('images as variant_images', 'product_variants.id', '=', 'variant_images.variant_id') // Lấy ảnh biến thể
    //             ->where('product_variants.product_id', $product->id)
    //             ->select(
    //                 'product_variants.id',
    //                 'product_variants.price',
    //                 'product_variants.stock',
    //                 // 'variant_images.image_url as variant_image_url', // Ảnh của biến thể
    //                 // 'variant_images.alt_text as variant_alt_text'
    //             )
    //             ->get();
    //     }

    //     // Tương tự cho sản phẩm tồn kho cao
    //     $highStockProducts = DB::table('products')
    //         ->leftJoin('images', 'products.id', '=', 'images.product_id')  // Lấy ảnh của sản phẩm
    //         ->leftJoin('product_variants', 'products.id', '=', 'product_variants.product_id')
    //         ->leftJoin('images as variant_images', 'product_variants.id', '=', 'variant_images.variant_id') // Lấy ảnh của biến thể từ bảng images
    //         ->select(
    //             'products.id',
    //             'products.name',
    //             'images.image_url as product_image_url', // Ảnh của sản phẩm
    //             'images.alt_text as product_alt_text',
    //             DB::raw('SUM(product_variants.stock) as stock'), // Tổng tồn kho các biến thể
    //             DB::raw('MAX(product_variants.price) as price_max'),
    //             DB::raw('MIN(product_variants.price) as price_min'),
    //             // 'variant_images.image_url as variant_image_url', // Ảnh của biến thể
    //             // 'variant_images.alt_text as variant_alt_text'
    //         )
    //         ->where('products.stock', '>', 0)
    //         ->whereNotNull('product_variants.id') // Lọc sản phẩm không có biến thể
    //         ->groupBy('products.id', 'products.name', 'images.image_url', 'images.alt_text', 'variant_images.image_url', 'variant_images.alt_text')
    //         ->orderBy('products.stock', 'desc')
    //         ->limit(10)
    //         ->get();

    //     foreach ($highStockProducts as $product) {
    //         $product->variants = DB::table('product_variants')
    //             ->leftJoin('images as variant_images', 'product_variants.id', '=', 'variant_images.variant_id') // Lấy ảnh biến thể
    //             ->where('product_variants.product_id', $product->id)
    //             ->select(
    //                 'product_variants.id',
    //                 'product_variants.price',
    //                 'product_variants.stock',
    //                 // 'variant_images.image_url as variant_image_url', // Ảnh của biến thể
    //                 // 'variant_images.alt_text as variant_alt_text'
    //             )
    //             ->get();
    //     }

    //     // Trộn hai mảng sản phẩm lại xen kẽ
    //     $combinedProducts = [];
    //     $slowSellingProducts = $slowSellingProducts->toArray();
    //     $highStockProducts = $highStockProducts->toArray();

    //     $maxLength = max(count($slowSellingProducts), count($highStockProducts));

    //     for ($i = 0; $i < $maxLength; $i++) {
    //         if (isset($slowSellingProducts[$i])) {
    //             $combinedProducts[] = $slowSellingProducts[$i];
    //         }
    //         if (isset($highStockProducts[$i])) {
    //             $combinedProducts[] = $highStockProducts[$i];
    //         }
    //     }

    //     return $this->success($combinedProducts);
    // }

    public function index()

    {
        $products = Product::with('productvariants.images', 'image')->latest('id')->get();

        return $this->success($products);
    }

    public function indexClient()
    {
        $products = Product::with(['productVariants.images'])
            ->whereHas('productVariants')  // Lọc chỉ những sản phẩm có biến thể
            ->latest('id')
            ->get();

        $products->map(function ($product) {
            $product['stock'] = $product->productVariants->sum('stock');
            $product['price_max'] = $product->productVariants->max('price');
            $product['price_min'] = $product->productVariants->min('price');
            $product['image_url'] = Image::where('product_id', $product['id'])->first()->image_url;
            $product['alt_text'] = Image::where('product_id', $product['id'])->first()->alt_text;

            return $product;
        });


        return $this->success($products);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            // Lưu hình ảnh vào thư mục public/storage/images
            $path = $request->file('image')->store('images', 'public');

            // Tạo sản phẩm mới
            $pro = [
                'name' => $request->name,
                // 'price' => $request->price,
                'sku' => $request->sku,
                'description' => $request->description,
                'category_id' => $request->category_id,
                'stock' => 0,
                // 'stock' => $request->stock,
                // 'size_id'=> $request->size_id,
                // 'color_id'=> $request->color_id,

            ];
            $product = Product::create($pro);

            // Ghi thông tin hình ảnh vào bảng Image
            $data = [
                'product_id' => $product->id,
                'image_url' => $path
            ];
            Image::create($data);

            DB::commit();

            // Trả về dữ liệu sản phẩm đã tạo
            return $this->success($product);
        } catch (Throwable $e) {
            DB::rollback();
            return $this->error($e->getMessage());
        }
    }

    public function show(Product $product)
    {
        // Lấy tổng số lượng tồn kho và các giá trị giá tối đa, tối thiểu
        $product['stock'] = $product->productVariants->sum('stock');
        $product['price_max'] = $product->productVariants->max('price');
        $product['price_min'] = $product->productVariants->min('price');

        // Lấy hình ảnh đầu tiên của sản phẩm
        $images = $product->image()->first();
        $product['image_url'] = $images['image_url'];
        $product['alt_text'] = $images['alt_text'];

        // Khởi tạo các mảng để chứa màu sắc và kích cỡ
        $product['color'] = collect();  // Sử dụng collect() thay vì mảng thông thường
        $product['size'] = collect();   // Sử dụng collect() thay vì mảng thông thường

        // Lọc các biến thể có tồn kho lớn hơn 0 và thu thập thông tin
        foreach ($product->productVariants as $variant) {
            if ($variant->stock > 0) { // Kiểm tra nếu biến thể có tồn kho
                $variant['color'] = $variant->color()->first()['color_name'];
                $variant['size'] = $variant->size()->first()['size_name'];
                $variant['image'] = $variant->images()->get();

                // Sử dụng phương thức push() để thêm phần tử vào collection
                $product['color']->push(['id' => $variant['color_id'],
                 'name' => $variant['color'],
                 'availableColors' => $product->productVariants->pluck('size.size_name')
                 ->unique()
                 ->values()
                 ->toArray()
                ]);
                $product['size']->push(['id' => $variant['size_id'],
                 'name' => $variant['size'],
                 'availableSizes' => $product->productVariants->pluck('color.color_name')
                 
                 ->unique()
                 ->values()
                 ->toArray()
                ]);

                // Loại bỏ phần tử trùng lặp dựa trên 'id' sau khi thêm
                $product['color'] = $product['color']->unique('id')->values();
                $product['size'] = $product['size']->unique('id')->values();
            }
        }

        return $this->success($product);
    }

    public function update(Request $request, Product $product)
    {

        try {
            if ($request->has('is_active')) {
                $product->is_active = filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN) ? 1 : 0;
            }
            DB::beginTransaction();

            // Kiểm tra nếu có hình ảnh mới, thì lưu lại và cập nhật đường dẫn
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('images', 'public');

                // Xóa hình ảnh cũ nếu cần (nếu muốn lưu lại, bỏ qua bước này)
                if ($product->image) {
                    Storage::disk('public')->delete($product->image->image_url);
                    $product->image->update(['image_url' => $path]);
                } else {
                    // Thêm hình ảnh nếu sản phẩm chưa có hình ảnh
                    Image::create([
                        'product_id' => $product->id,
                        'image_url' => $path,
                    ]);
                }
            }


            // Cập nhật thông tin sản phẩm
            $product->update($request->only([
                'name',
                // 'price',
                'sku',
                'description',
                'category_id',
                'stock',
                // 'size_id',
                // 'color_id',

            ]));

            DB::commit();

            return $this->success($product, 'Product updated successfully');
        } catch (Throwable $e) {
            DB::rollback();
            return $this->error($e->getMessage());
        }
        if ($request->has('is_active')) {
            $product->is_active = $request->is_active;
        }
    }

    public function destroy(Product $product)
    {
        $data = [
            "is_active" => false,
            "deleted_at" => date('Y-m-d H:i:s')
        ];
        return $this->edit($product, $data);
    }

    public function search(Request $request)
    {
        return $this->get($this->model, null, 'name', $request->key, null, null, null);
    }

    public function filter(Request $request, $categoryId = null)
    {
        $minPrice = $request->input('min_price');
        $maxPrice = $request->input('max_price');
        $sortOrder = $request->input('sort_order'); // A-Z or Z-A

        $query = Product::query();

        if ($minPrice && $maxPrice) {
            $query->whereBetween('price', [$minPrice, $maxPrice]);
        } elseif ($minPrice) {
            $query->where('price', '>=', $minPrice);
        } elseif ($maxPrice) {
            $query->where('price', '<=', $maxPrice);
        }

        if ($categoryId) {
            $query->where('category_id', $categoryId);
            $category = Category::find($categoryId);
            $datas["category_name"] = $category->name;
        }

        // Sắp xếp theo tên sản phẩm (A-Z hoặc Z-A)
        if ($sortOrder === 'A-Z') {
            $query->orderBy('name', 'asc');
        } elseif ($sortOrder === 'Z-A') {
            $query->orderBy('name', 'desc');
        } else {
            $query->latest('id'); // mặc định sắp xếp theo id mới nhất
        }

        $products = $query->get();

        if ($products->isEmpty()) {
            return $this->error('No products found for this category');
        }

        $datas["products"] = $products;

        return $this->success($datas);
    }

    public function getRelatedProducts($id, Product $product)
{
    // Lấy sản phẩm
    $product = Product::find($id);
    if (!$product) {
        return BaseController::error('Product not found');
    }

    // Tính giá min, max của sản phẩm hiện tại (nếu cần)
    $product['price_max'] = $product->productVariants->max('price');
    $product['price_min'] = $product->productVariants->min('price');

    // Gợi ý sản phẩm dựa trên danh mục
    $relatedProducts = Product::where('category_id', $product->category_id)
        ->where('id', '!=', $product->id) // Loại trừ chính nó
        ->with('image', 'productVariants') // Lấy cả hình ảnh và biến thể sản phẩm
        ->limit(10) // Giới hạn số lượng sản phẩm liên quan
        ->get();

    // Tính giá min, max cho mỗi sản phẩm liên quan
    $relatedProducts->each(function ($relatedProduct) {
        $relatedProduct['price_max'] = $relatedProduct->productVariants->max('price');
        $relatedProduct['price_min'] = $relatedProduct->productVariants->min('price');
    });

    return BaseController::success($relatedProducts);
}
public function getVariants($id)
{
    try {
        // Kiểm tra sản phẩm tồn tại
        $product = Product::findOrFail($id);

        // Lấy biến thể của sản phẩm
        $productVariants = $product->productVariants; 
       
        return response()->json([
            'success' => true,
            'data' => $productVariants,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Không thể lấy biến thể sản phẩm.',
        ], 500);
    }
}
}
