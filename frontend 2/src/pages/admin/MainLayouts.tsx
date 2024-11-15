import React from "react";
import { Layout, Menu } from "antd";
import {
  ShoppingCartOutlined,
  FileTextOutlined,
  UserOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Outlet, Link } from "react-router-dom";
import Categories from './Categories'; 
const { Header, Content, Footer, Sider } = Layout;

const AdminLayout = () => {
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
            <Link to="/admin">Quản lý tài khoản</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<ShoppingCartOutlined />}>
            <Link to="/admin/orders">Quản lý giỏ hàng</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<FileTextOutlined />}>
            <Link to="/admin/reviews">Quản lý bình luận</Link>
          </Menu.Item>
          <Menu.Item key="6" icon={<FileTextOutlined />}>
            <Link to="/admin/product-variants">Quản lý biến thể</Link>
          </Menu.Item>
          <Menu.Item key="7" icon={<FileTextOutlined />}>
            <Link to="/admin">Quản lý khuyến mãi</Link>
          </Menu.Item>
          <Menu.Item key="8" icon={<FileTextOutlined />}>
            <Link to="/admin/blogs">Quản lý bài viết</Link>
          </Menu.Item>
          <Menu.Item key="9" icon={<PieChartOutlined />}>
            <Link to="/admin/statistics">Thống kê</Link>
          </Menu.Item>
          <Menu.Item key="10" icon={<PieChartOutlined />}>
            <Link to="/login"> Đăng nhập</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: 0 }} />
        <Content style={{ margin: "0 16px" }}>
          <div style={{ padding: 24, minHeight: 360 }}>
            <Outlet /> {/* Đây là nơi các component sẽ được hiển thị */}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>Admin Dashboard ©2024</Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
