<?php 

namespace App\Http\Controllers\API;


use App\Http\Controllers\BaseController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class UserController extends BaseController
{
    function allAdrressesUser(){
        $user = Auth::user();
        $adrress = $user->addresses;
        return $this->success($adrress);

    }

    public function updateDefaultAdressesUser(Request $request)
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
}

