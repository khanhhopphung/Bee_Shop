<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;

class BaseCrudController extends Controller
{
    /**
     * Model mà controller sẽ làm việc với nó
     */
    protected $model;

    /**
     * Trả về danh sách các bản ghi.
     *
     * @return JsonResponse
     */
    public function getAll(): JsonResponse
    {
        $data = $this->model::all();
        return $this->sendResponse($data, 'Data retrieved successfully');
    }

    /**
     * Trả về chi tiết của một bản ghi theo ID.
     *
     * @param  int  $id
     * @return JsonResponse
     */
    public function show($id): JsonResponse
    {
        $item = $this->model::find($id);

        if (is_null($item)) {
            return $this->sendNotFound('Item not found');
        }

        return $this->sendResponse($item, 'Data retrieved successfully');
    }

    /**
     * Tạo một bản ghi mới.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function post(Request $request)
    {
        $validatedData = $this->validateRequest($request);
        $item = $this->model::create( $validatedData );
        return $this->sendResponse($item, 'Data created successfully', 201);
    }

    /**
     * Cập nhật một bản ghi.
     *
     * @param  Request  $request
     * @param  int  $id
     * @return JsonResponse
     */
    public function update(Request $request, $id): JsonResponse
    {
        $item = $this->model::find($id);

        if (is_null($item)) {
            return $this->sendNotFound('Item not found');
        }

        $validatedData = $this->validateRequest($request);
        $item->update($validatedData);

        return $this->sendResponse($item, 'Data updated successfully');
    }

    /**
     * Xóa một bản ghi.
     *
     * @param  int  $id
     * @return JsonResponse
     */
    public function destroy($id): JsonResponse
    {
        $item = $this->model::find($id);

        if (is_null($item)) {
            return $this->sendNotFound('Item not found');
        }

        $item->delete();
        return $this->sendResponse(null, 'Data deleted successfully');
    }

    /**
     * Validate dữ liệu đầu vào, có thể tùy chỉnh trong các controller con.
     *
     * @param  Request  $request
     * @return array
     */
    protected function validateRequest(Request $request): array
    {
        // Các quy tắc validate cơ bản (các controller con có thể override hàm này)
        return $request->validate([
            // Thêm các quy tắc validate ở đây
        ]);
    }

    /**
     * Phương thức phản hồi thành công.
     *
     * @param mixed $data
     * @param string $message
     * @param int $statusCode
     * @return JsonResponse
     */
    protected function sendResponse($data, $message = 'Success', $statusCode = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $statusCode);
    }

    /**
     * Phương thức phản hồi khi không tìm thấy dữ liệu.
     *
     * @param string $message
     * @return JsonResponse
     */
    protected function sendNotFound($message = 'Item not found'): JsonResponse
    {
        return $this->sendError($message, 404);
    }

    /**
     * Phương thức phản hồi khi có lỗi.
     *
     * @param string $message
     * @param int $statusCode
     * @return JsonResponse
     */
    protected function sendError($message, $statusCode = 400): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
        ], $statusCode);
    }
}
