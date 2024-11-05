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

class ProductController extends BaseController
{
    public function __construct()
    {
        $this->model = Product::class;
    }
    public function index()

    {       
        // $products = Product::with('image.image_url')->latest('id')->get();
        //     // return $this->get( $this->model);
        //     return $this->success($products);

            $products = Product::with('image')->latest('id')->get();
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
            'price' => $request->price,
            'sku' => $request->sku,
            'description' => $request->description,
            'category_id' => $request->category_id,
            'stock' => $request->stock
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



    /**
     * Display the specified resource.
     */
    public function show(Product $product)
{
    // Lấy sản phẩm cùng với hình ảnh liên quan
    $productWithImage = Product::with('image')->find($product->id);

    return $this->success($productWithImage);
}



  
//     /**
//      * Update the specified resource in storage.
//      */
    public function update(UpdateProductRequest $request, Product $product)
    {

            return $this->edit($product, $request->all());
        
    }

//     /**
//      * Remove the specified resource from storage.
//      */
    public function destroy(Product $product)
    {
        $data = [
            "is_active" => false,
            "deleted_at" => date('Y-m-d H:i:s')
        ];
        return $this->edit($product, $data );
        
    }

    public function search(Request $request){
        return $this->get( $this->model, null,'name',$request->key,null,null,null);
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

    
}