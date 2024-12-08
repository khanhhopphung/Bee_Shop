<?php 

namespace App\Http\Controllers\API;


use App\Http\Controllers\BaseController;
use App\Http\Requests\UpdateUserRequest;
use App\Models\Order;
use App\Models\ShippingAddress;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Throwable;

class UserController extends BaseController
{
    function allAddressesUser() {
        $user = Auth::user();
    
        // Lấy danh sách địa chỉ, sắp xếp theo `is_default` để đảm bảo địa chỉ mặc định ở trên cùng
        $addresses = $user->addresses()->orderByDesc('is_default')->get();
    
        return response()->json([
            'success' => true,
            'data' => $addresses,
        ]);
    }
  
    public function updateDefaultAddressesUser(Request $request) {
        $user = Auth::user();
    
        // Tìm địa chỉ cần cập nhật
        $addressToUpdate = $user->addresses()->find($request->id);
    
        if (!$addressToUpdate) {
            return response()->json(['message' => 'Address not found'], 404);
        }
    
        // Bắt đầu giao dịch
        DB::beginTransaction();
    
        try {
            // Đặt địa chỉ này thành mặc định
            $addressToUpdate->is_default = 1;
            $addressToUpdate->save();
    
            // Đặt các địa chỉ khác thành không mặc định
            $user->addresses()->where('id', '!=', $request->id)->update(['is_default' => 0]);
    
            // Commit giao dịch
            DB::commit();
    
            // Trả về danh sách địa chỉ mới sau khi cập nhật
            $updatedAddresses = $user->addresses()->orderByDesc('is_default')->get();
    
            return response()->json([
                'message' => 'Update default address successfully',
                'data' => $updatedAddresses,
            ], 200);
        } catch (\Exception $e) {
            // Rollback nếu có lỗi
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update default address',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Lấy danh sách người dùng
    public function index()
    {
        return User::all();
    }

    // Tạo người dùng mới
    public function store(Request $request)
    {
        // Validate the request
        $validatedData = $request->validate([
            'username' => 'required|string|max:255',
            'password_hash' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',
            'role_id' => 'required|integer',
            'tier_id' => 'required|integer',
        ]);

        // Create the user
        $user = User::create($validatedData); // Ensure User::create() is correctly called

        return response()->json($user, 201);
    }

    // Lấy thông tin người dùng theo ID
    public function show($id)
    {
        return User::findOrFail($id);
    }

    public function showUser()
    {
        $user = Auth::user();
        return $this->success($user);
    }

    // Cập nhật thông tin người dùng
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->update($request->all());
        return response()->json($user, 200);
    }

  
    public function destroy(user $user )
    {
        $user -> update( ["is_active"=>false]);
        return response()->json([
            "status" => "success",
            "message"=> "update thanh cong"
        ]);
    }
    public function deleteAddress(string $id)
    {
        $user = Auth::user(); // Lấy người dùng đã đăng nhập
    
        // Tìm địa chỉ cần xóa
        $address = $user->addresses->where('id',$id)->where('user_id',$user->id)->first();
        // $orders = ShippingAddress::where('id',$addressId)->where('user_id',$user->id)->get();
  
        $order = Order::where('user_id',$user->id)->where('address_id',$address->id)->update(['address_id' => 0]);
       
        // return $addressId ;
        if ($address) {
            // Xóa địa chỉ
            $address->delete();

    
            return response()->json([
                "status" => "success",
                "message" => "Địa chỉ đã bị xóa thành công"
            ]);
        }
    
        return response()->json([
            "status" => "error",
            "message" => "Địa chỉ không tồn tại"
        ], 404);
    }

    public function addAddress(Request $request)
    {
        // Xác thực dữ liệu đầu vào
        $validatedData = $request->validate([
        'recipient_name' => 'required|string|max:255',
        'phone'          => 'required|string|max:15',
        'address_line'   => 'required|string|max:255',
        'city'           => 'required|string|max:100',
        'state'          => 'required|string|max:100',
        'is_default' => 'boolean', // Có thể thêm mặc định hay không
        ]);

        // Lấy người dùng hiện tại
        $user = Auth::user();

        // Bắt đầu giao dịch
        DB::beginTransaction();

        try {
            // Nếu is_default là true, đặt các địa chỉ khác về không mặc định
            if (isset($validatedData['is_default']) && $validatedData['is_default']) {
                $user->addresses()->update(['is_default' => false]);
            }

            // Tạo địa chỉ mới
            $newAddress = $user->addresses()->create($validatedData);

            // Hoàn tất giao dịch
            DB::commit();

            return $this->success($newAddress, 'Address added successfully');
        } catch (\Exception $e) {
            // Hoàn tác giao dịch nếu có lỗi
            DB::rollBack();
            return $this->error('Failed to add address: ' . $e->getMessage());
        }
    }
    public function updateAddress(Request $request, string $id)
{
    $user = Auth::user();
    
    // Tìm địa chỉ cụ thể của người dùng
    $address = $user->addresses()->find($id);

    if (!$address) {
        return response()->json(['message' => 'Address not found'], 404);
    }

    // Cập nhật thông tin địa chỉ từ request
    $address->update([
        'recipient_name' => $request->recipient_name,
        'phone' => $request->phone,
        'address_line' => $request->address_line,
        'city' => $request->city,
        'state' => $request->state,
    ]);

    return response()->json(['message' => 'Address updated successfully', 'data' => $address], 200);
    }
    public function updatePhone(UpdateUserRequest $request,string $id)
{
  
   try{
 // Kiểm tra xem số điện thoại mới có bị trùng không
 $existingUser = User::where('phone', $request->phone)->where('id', '!=', $id)->first();

 if ($existingUser) {
     return response()->json(['message' => 'Số điện thoại này đã được sử dụng'], 400);
 }

 // Tìm người dùng theo ID
 $user = User::findOrFail($id);

 // Cập nhật số điện thoại của người dùng
 $user->update([
     'phone' => $request->phone, // Chỉ cập nhật trường 'phone'
 ]);

 // Trả về thông tin người dùng đã cập nhật
 return response()->json($user, 200);
   }catch (Throwable $e) {
    DB::rollback();
    return $this->error($e->getMessage());
}
}


}

