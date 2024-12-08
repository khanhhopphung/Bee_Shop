import React, { useEffect, useState } from "react";
import { Layout, Menu, Spin } from "antd";
import {
  ShoppingCartOutlined,
  FileTextOutlined,
  UserOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Outlet, Link, useNavigate } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

interface User {
  role_id: number;
  // Thêm các thuộc tính khác của user nếu cần
}

const AdminLayout = () => {
  const [user, setUser] = useState<User | null>(null); // Lưu thông tin người dùng
  const [loading, setLoading] = useState<boolean>(true); // Trạng thái loading khi lấy dữ liệu
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser: User = JSON.parse(userData);
      setUser(parsedUser);
      setLoading(false); // Dữ liệu người dùng đã được tải, tắt loading
    } else {
      setLoading(false); // Nếu không có thông tin người dùng, tắt loading
      navigate("/login"); // Điều hướng đến trang đăng nhập
    }
  }, [navigate]);

  useEffect(() => {
    if (user) {
      // Kiểm tra quyền truy cập của người dùng
      if (user.role_id != 2) {
        navigate("/login"); // Điều hướng nếu người dùng không có quyền admin
      }
    }
  }, [user, navigate]);

  if (loading) {
    return <Spin tip="Đang tải dữ liệu..." />; // Hiển thị loading khi đang lấy dữ liệu
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider>
        <Menu theme="dark" mode="inline">
          <Menu.Item key="1" icon={<ShoppingCartOutlined />}>
            <Link to="/admin/products">Quản lý sản phẩm</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<FileTextOutlined />}>
            <Link to="/admin/categories">Quản lý danh mục</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<UserOutlined />}>
            <Link to="/admin/users">Quản lý tài khoản</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<ShoppingCartOutlined />}>
            <Link to="/admin/orders">Quản lý đơn hàng</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<FileTextOutlined />}>
            <Link to="/admin/reviews">Quản lý bình luận</Link>
          </Menu.Item>
          <Menu.Item key="6" icon={<FileTextOutlined />}>
            <Link to="/admin/product-variants">Quản lý biến thể</Link>
          </Menu.Item>
          <Menu.Item key="7" icon={<FileTextOutlined />}>
            <Link to="/admin/promotions">Quản lý khuyến mãi</Link>
          </Menu.Item>
          <Menu.Item key="8" icon={<FileTextOutlined />}>
            <Link to="/admin/blogs">Quản lý bài viết</Link>
          </Menu.Item>
          <Menu.Item key="9" icon={<PieChartOutlined />}>
            <Link to="/admin/statistics">Thống kê</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: 0 }} />
        <Content style={{ margin: "0 16px" }}>
          <div style={{ padding: 24, minHeight: 360 }}>
            <Outlet /> {/* Vị trí hiển thị nội dung con */}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>Admin Dashboard ©2024</Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;


