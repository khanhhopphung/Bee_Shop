<?php

namespace App\Policies;

use App\Models\ProductVariant;
use App\Models\User;

class ProductVariantPolicy
{
    public function viewAny(User $user): bool
    {
        // Logic kiểm tra quyền xem tất cả các ProductVariant (nếu có)
        return true; // Hoặc false tùy vào quyền của người dùng
    }

    public function view(User $user, ProductVariant $productVariant): bool
    {
        // Logic kiểm tra quyền xem một ProductVariant
        return true; // Hoặc false tùy vào quyền của người dùng
    }

    public function create(User $user): bool
    {
        // Logic kiểm tra quyền tạo ProductVariant
        return true; // Hoặc false tùy vào quyền của người dùng
    }

    public function update(User $user, ProductVariant $productVariant): bool
    {
        // Logic kiểm tra quyền cập nhật ProductVariant
        return true; // Hoặc false tùy vào quyền của người dùng
    }

    public function delete(User $user, ProductVariant $productVariant): bool
    {
        // Logic kiểm tra quyền xóa ProductVariant
        return true; // Hoặc false tùy vào quyền của người dùng
    }

    public function restore(User $user, ProductVariant $productVariant): bool
    {
        // Logic kiểm tra quyền khôi phục ProductVariant
        return true; // Hoặc false tùy vào quyền của người dùng
    }

    public function forceDelete(User $user, ProductVariant $productVariant): bool
    {
        // Logic kiểm tra quyền xóa vĩnh viễn ProductVariant
        return true; // Hoặc false tùy vào quyền của người dùng
    }
}
