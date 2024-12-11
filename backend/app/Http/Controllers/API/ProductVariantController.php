<?php

namespace App\Http\Controllers\API;

use App\Events\NewProductEvent;
use App\Events\ProductEvent;
use App\Http\Controllers\BaseController;
use App\Models\ProductVariant;
use App\Http\Requests\StoreProductVariantRequest;
use App\Http\Requests\UpdateProductVariantRequest;
use App\Models\Image;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Throwable;
use Illuminate\Support\Facades\DB;

class ProductVariantController extends BaseController
{
    public function __construct()
    {
        $randomCode = uniqid('prod_', true);        
        event(new ProductEvent($randomCode));
        $this->model = ProductVariant::class;
    }

    public function index()
    {
        // Eager load only 'image' for the variants
        $productVariants = ProductVariant::with('images')->latest('id')->get();
    return $this->success($productVariants);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    try {
        DB::beginTransaction();

        // Tạo biến thể sản phẩm
        $variant = ProductVariant::create([
            'product_id' => $request->product_id,
            'size_id' => $request->size_id,
            'color_id' => $request->color_id,
            'price' => $request->price,
            'stock' => $request->stock,
            'is_active' => $request->is_active ? 1 : 0, // Convert true/false to 1/0
        ]);

        // Kiểm tra và lưu nhiều ảnh
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('images', 'public');
                Image::create([
                    'variant_id' => $variant->id,
                    'product_id' => $request->product_id,
                    'image_url' => $path,
                ]);
            }
        }

        DB::commit();

        return $this->success($variant, 'Thêm biến thể sản phẩm thành công.');
    } catch (Throwable $e) {
        DB::rollback();
        return $this->error('Lỗi khi thêm biến thể sản phẩm: ' . $e->getMessage());
    }
}
    
    /**
     * Display the specified resource.
     */
    public function show(ProductVariant $productVariant)
    {
        // Eager load quan hệ 'images'
        $variantWithImages = ProductVariant::with('images')->find($productVariant->id);
        return $this->success($variantWithImages);
    }

    /**
     * Update the specified resource in storage.
     */
   /**
 * Update the specified resource in storage.
 */
/**
 * Update the specified resource in storage.
 */
public function update(Request $request, ProductVariant $productVariant)
{
       
     
    try {
        DB::beginTransaction();

        // Cập nhật các trường khác của ProductVariant
        $productVariant->update([
            'product_id' => $request->product_id ?? $productVariant->product_id,
            'size_id'    => $request->size_id ?? $productVariant->size_id,
            'color_id'   => $request->color_id ?? $productVariant->color_id,
            'price'      => $request->price ?? $productVariant->price,
            'stock'      => $request->stock ?? $productVariant->stock,
            'is_active'  => $request->is_active !== null ? (bool)$request->is_active : $productVariant->is_active,
        ]);
    //     $product = Product::find($productVariant->product_id);
    //     $images = $product->image()->first();
    //     $product['image_url'] = $images['image_url'];
    //     $product['alt_text'] = $images['alt_text'];
    //      // Khởi tạo các mảng để chứa màu sắc và kích cỡ
    //    $product['color'] = collect();  // Sử dụng collect() thay vì mảng thông thường
    //    $product['size'] = collect();   // Sử dụng collect() thay vì mảng thông thường
    //    foreach ($product->productVariants as $variant) {
    //        if ($variant->stock > 0) { // Kiểm tra nếu biến thể có tồn kho
    //            $variant['color'] = $variant->color()->first()['color_name'];
    //            $variant['size'] = $variant->size()->first()['size_name'];
    //            $variant['image'] = $variant->images()->get();
   
    //            // Sử dụng phương thức push() để thêm phần tử vào collection
    //            $product['color']->push(['id' => $variant['color_id'],
    //             'name' => $variant['color'],
    //             'availableColors' => $product->productVariants->pluck('size.size_name')
    //             ->unique()
    //             ->values()
    //             ->toArray()
    //            ]);
    //            $product['size']->push(['id' => $variant['size_id'],
    //             'name' => $variant['size'],
    //             'availableSizes' => $product->productVariants->pluck('color.color_name')
                
    //             ->unique()
    //             ->values()
    //             ->toArray()
    //            ]);
   
    //            // Loại bỏ phần tử trùng lặp dựa trên 'id' sau khi thêm
    //            $product['color'] = $product['color']->unique('id')->values();
    //            $product['size'] = $product['size']->unique('id')->values();
    //        }
    //    }
    // //    return $product;

    //     event(new NewProductEvent(...$product));

    $product = Product::find($productVariant->product_id);
$images = $product->image()->first();
$product->image_url = $images['image_url'];
$product->alt_text = $images['alt_text'];
$product->stock = $product->productVariants->sum('stock');
        $product->price_max = $product->productVariants->max('price');
        $product->price_min = $product->productVariants->min('price');
// Khởi tạo các mảng để chứa màu sắc và kích cỡ
$product->color = collect();
$product->size = collect();

foreach ($product->productVariants as $variant) {
    if ($variant->stock > 0) { // Kiểm tra nếu biến thể có tồn kho
        $variantColor = $variant->color()->first();
        $variantSize = $variant->size()->first();
        
        $variant->color = $variantColor['color_name'];
        $variant->size = $variantSize['size_name'];
        $variant->images = $variant->images()->get();

        // Sử dụng phương thức push() để thêm phần tử vào collection
        $product->color->push([
            'id' => $variant['color_id'],
            'name' => $variant->color,
            'availableColors' => $product->productVariants->pluck('size.size_name')->unique()->values()->toArray()
        ]);
        
        $product->size->push([
            'id' => $variant['size_id'],
            'name' => $variant->size,
            'availableSizes' => $product->productVariants->pluck('color.color_name')->unique()->values()->toArray()
        ]);

        // Loại bỏ phần tử trùng lặp dựa trên 'id' sau khi thêm
        $product->color = $product->color->unique('id')->values();
        $product->size = $product->size->unique('id')->values();
    }
}

// Chuyển đổi thành mảng trước khi truyền vào sự kiện
// event(new NewProductEvent(
//     $product->id,
//     $product->name,
//     $product->sku,
//     $product->description,
//     $product->category_id,
//     $product->stock,
//     $product->price_max ?? null,
//     $product->price_min ?? null,
//     $product->image_url,
//     $product->alt_text,
//     $product->color->toArray(),
//     $product->size->toArray(),
//     $product->productVariants->toArray()
// ));



        // Kiểm tra và cập nhật nhiều ảnh
        if ($request->hasFile('images')) {
            // Xóa tất cả ảnh cũ nếu muốn xóa
            foreach ($productVariant->images as $image) {
                if (\Storage::disk('public')->exists($image->image_url)) {
                    \Storage::disk('public')->delete($image->image_url); // Xóa file khỏi storage
                }
                $image->delete(); // Xóa record ảnh trong database
            }

            // Lưu ảnh mới
            foreach ($request->file('images') as $file) {
                $path = $file->store('images', 'public');
                Image::create([
                    'variant_id' => $productVariant->id,
                    'product_id' => $request->product_id,
                    'image_url' => $path,
                ]);
            }
        }

        DB::commit();

        // Trả về dữ liệu mới nhất của ProductVariant cùng với hình ảnh
        return $this->success($productVariant->load('images'), 'Cập nhật biến thể sản phẩm thành công.');
    } catch (Throwable $e) {
        DB::rollback();
        // Trả về thông báo lỗi chi tiết
        return $this->error('Lỗi khi cập nhật biến thể sản phẩm: ' . $e->getMessage()
        .'line'.$e->getLine().'file'.$e->getFile(), 500);
    }
}

    /**
     * Remove the specified resource from storage.
     */
    /**
 * Remove the specified resource from storage.
 */
public function destroy(ProductVariant $productVariant)
{
    try {
        DB::beginTransaction();

        // Xóa tất cả ảnh liên quan
        foreach ($productVariant->images as $image) {
            if (\Storage::disk('public')->exists($image->image_url)) {
                \Storage::disk('public')->delete($image->image_url); // Xóa file khỏi storage
            }
            $image->delete(); // Xóa record ảnh trong database
        }

        // "Xóa mềm" product variant
        $productVariant->update([
            'is_active' => false,
            'deleted_at' => now(),
        ]);

        DB::commit();

        return $this->success(null, 'Xóa biến thể sản phẩm thành công.');
    } catch (Throwable $e) {
        DB::rollback();
        return $this->error('Lỗi khi xóa biến thể sản phẩm: ' . $e->getMessage());
    }
}

}
