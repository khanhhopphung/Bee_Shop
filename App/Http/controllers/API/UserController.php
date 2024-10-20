<?php 

namespace App\Http\Controllers\API;

use App\Http\Controllers\API\Controller;
use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use GuzzleHttp\Psr7\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
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
    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'user not found'], 404);
        }

        $user->delete();
        return response()->json(['status' => 'success', 'message' => 'user deleted successfully']);
    }
}

?>