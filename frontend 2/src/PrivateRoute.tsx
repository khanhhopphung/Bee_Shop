import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { message } from "antd";

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const location = useLocation();
  const adminUser = localStorage.getItem("adminUser");

  useEffect(() => {
    if (!adminUser) {
      message.error("Bạn phải đăng nhập admin mới có thể vào.");
    } else {
      const user = JSON.parse(adminUser);
      if (user.role_id !== 2) {
        message.error("Bạn không có quyền truy cập vào trang quản trị.");
      }
    }
  }, [adminUser]);

  if (!adminUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const user = JSON.parse(adminUser);
  if (user.role_id !== 2) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
