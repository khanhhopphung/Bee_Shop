<?php

namespace App\Http\Controllers\API;

use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    // Lấy danh sách tất cả các vai trò
    public function index()
    {
        $roles = Role::all();
        return response()->json(['status' => 'success', 'data' => $roles]);
    }

    // Lấy chi tiết một vai trò theo ID
    public function show($id)
    {
        $role = Role::find($id);
        if (!$role) {
            return response()->json(['status' => 'error', 'message' => 'Role not found'], 404);
        }
        return response()->json(['status' => 'success', 'data' => $role]);
    }

    // Tạo mới một vai trò
    public function store(Request $request)
    {
        $request->validate([
            'role_name' => 'required|string|max:50',
            'description' => 'nullable|string|max:255',
            'is_active' => 'required|boolean',
        ]);

        $role = Role::create($request->all());
        return response()->json(['status' => 'success', 'message' => 'Role created successfully', 'data' => $role], 201);
    }

    // Cập nhật một vai trò theo ID
    public function update(Request $request, $id)
    {
        $role = Role::find($id);
        if (!$role) {
            return response()->json(['status' => 'error', 'message' => 'Role not found'], 404);
        }

        $request->validate([
            'role_name' => 'required|string|max:50',
            'description' => 'nullable|string|max:255',
            'is_active' => 'required|boolean',
        ]);

        $role->update($request->all());
        return response()->json(['status' => 'success', 'message' => 'Role updated successfully', 'data' => $role]);
    }

    // Xóa một vai trò theo ID
    public function destroy($id)
    {
        $role = Role::find($id);
        if (!$role) {
            return response()->json(['status' => 'error', 'message' => 'Role not found'], 404);
        }

        $role->delete();
        return response()->json(['status' => 'success', 'message' => 'Role deleted successfully']);
    }
}
