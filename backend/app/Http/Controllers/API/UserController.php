<?php 

namespace App\Http\Controllers\API;


use App\Http\Controllers\BaseController;
use App\Models\Order;
use App\Models\ShippingAddress;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class UserController extends BaseController
{
    function allAddressesUser(){
        $user = Auth::user();
        $address = $user->addresses;
        return $this->success($address);

    }

    public function updateDefaultAddressesUser(Request $request)
{
    // Lấy thông tin người dùng đã đăng nhập
    $user = Auth::user();
    
    // Tìm địa chỉ cần cập nhật
    $addressToUpdate = $user->addresses()->find($request->id);  // Sử dụng () để gọi phương thức query builder

    if ($addressToUpdate) {
        // Bắt đầu một giao dịch để đảm bảo tính toàn vẹn của dữ liệu
        DB::beginTransaction();

        try {
            // Cập nhật địa chỉ hiện tại thành mặc định (is_default = 1)
            $addressToUpdate->is_default = 1;
            $addressToUpdate->save();

            // Cập nhật tất cả các địa chỉ khác của người dùng thành không mặc định (is_default = 0)
            $user->addresses()->where('id', '!=', $request->id)->update(['is_default' => 0]);

            // Commit giao dịch nếu tất cả đều thành công
            DB::commit();

            // Trả về thông báo thành công
            return $this->success('Update default address successfully');
        } catch (\Exception $e) {
            // Nếu có lỗi, hoàn tác giao dịch
            DB::rollBack();
            return $this->error('Failed to update default address');
        }
    }

    return $this->error('Address not found');
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

    // // Xóa người dùng
    // public function destroy($id)
    // {
    //     User::destroy($id);
    //     return response()->json(null, 204);
    // }
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
    

}

