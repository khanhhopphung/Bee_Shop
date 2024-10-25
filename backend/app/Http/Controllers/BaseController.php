<?php

namespace App\Http\Controllers;

use App\Http\Responses\BaseResponse;
use Illuminate\Http\Response as HttpResponse;
use Throwable;
use Illuminate\Http\JsonResponse;
class BaseController extends Controller
{
    protected $model;

    public static function get($model, $limit = null, $col = null, $value = null, $keyword = null, $filters = [], $keywordSearchFor = [])
    {
        try {
            $query = $model::latest('id'); // Sắp xếp theo id mới nhất

            // Nếu có cột id và giá trị, tìm kiếm theo id cụ thể
            if ($col === 'id' && $value) {
                $data = $query->find($value);
                if (! $data) {
                    return self::error('Data not found', HttpResponse::HTTP_NOT_FOUND);
                }

                return self::success($data, 'Data retrieved successfully!', HttpResponse::HTTP_OK);
            }

            // Lọc theo từ khóa (nếu có)
            if ($keyword && ! empty($keywordSearchFor)) {
                $query->where(function ($q) use ($keyword, $keywordSearchFor) {
                    foreach ($keywordSearchFor as $field) {
                        $q->orWhere($field, 'like', '%'.$keyword.'%');
                    }
                });
            }

            // Lọc theo các trường khác bổ sung (nếu có)
            foreach ($filters as $filterField => $filterValue) {
                $query->where($filterField, $filterValue);
            }

            // Giới hạn số lượng kết quả trả về (nếu có)
            $query->when($limit, function ($q) use ($limit) {
                return $q->limit($limit);
            });

            // Nếu có cả cột và giá trị, thêm điều kiện where
            $query->when($col && $value, function ($q) use ($col, $value) {
                return $q->where($col, $value);
            });

            // Lấy dữ liệu
            $data = $query->get();

            // Nếu không có dữ liệu, trả về lỗi
            if ($data->isEmpty()) {
                return self::error('Data not found', HttpResponse::HTTP_NOT_FOUND);
            }

            // Trả về dữ liệu thành công
            return self::success($data, 'Data retrieved successfully!', HttpResponse::HTTP_OK);
        } catch (Throwable $e) {
            // Trả về lỗi server nếu có lỗi xảy ra
            return self::error($e->getMessage(), HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public static function updateStatus($model, $id, $col = null, $value = null)
    {
        try {
            $query = $model::find($id);
            if (empty($query)) {
                return self::error($message = 'Data not found !', $status = HttpResponse::HTTP_NOT_FOUND);
            }
            $query->when($col && $value, function ($q) use ($col, $value) {
                return $q->update([
                    $col => $value,
                ]);
            });

            return self::success($query, 'Data retrieved successfully !', HttpResponse::HTTP_OK);
        } catch (Throwable $e) {
            return self::error($e->getMessage(), HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

    }

    public static function insert($model, $request)
    {
        try {
            
             $model::create($request);


            return self::success($request, $message = 'Record created successfully !', $statusCode = HttpResponse::HTTP_CREATED);
        } catch (\Throwable $e) {
            return self::error($message = $e->getMessage(), $status = HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public static function edit($model, $request)
    {
        try {
            if (empty($model)) {
                return self::error($message = 'Data not found !', $status = HttpResponse::HTTP_NOT_FOUND);
            }

            
            $data = $model->update($request);

            return self::success($request, $message = 'Record updated successfully', $statusCode = HttpResponse::HTTP_OK);
        } catch (\Throwable $e) {
            return self::error($message = $e->getMessage(), $status = HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public static function delete($model, $id)
    {
        try {
            $data = $model::find($id);
            if (empty($data)) {
                return self::error($message = 'Data not found !', $status = HttpResponse::HTTP_NOT_FOUND);
            }
            $data->delete();

            return self::success(null, $message = 'Record deleted successfully !', $statusCode = HttpResponse::HTTP_OK);

        } catch (\Throwable $e) {
            return self::error($message = $e->getMessage(), $status = HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

    }
    
   




   
    public static function success($data = null, $message = 'Success', $statusCode = HttpResponse::HTTP_OK): JsonResponse
    {
        return response()->json([
            'status' => true,
            'message' => $message,
            'data' => $data,
        ], $statusCode);
    }

    public static function error($message = 'Error', $status = HttpResponse::HTTP_BAD_REQUEST): JsonResponse
    {
        return response()->json([
            'status' => false,
            'message' => $message,
        ], $status);
    }

}