import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { Outlet, Link } from "react-router-dom";

const { Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(
    <Link to="/admin/products">Quản lý sản phẩm</Link>,
    "1",
    <ShoppingCartOutlined />
  ),
  getItem(
    <Link to="/admin/categories">Quản lý danh mục</Link>,
    "2",
    <FileTextOutlined />
  ),
  getItem(
    <Link to="/admin/users">Quản lý tài khoản</Link>,
    "3",
    <UserOutlined />
  ),
  getItem(
    <Link to="/admin/orders">Quản lý đơn hàng</Link>,
    "4",
    <ShoppingCartOutlined />
  ),
  getItem(
    <Link to="/admin/reviews">Quản lý bình luận</Link>,
    "5",
    <FileTextOutlined />
  ),
  getItem(
    <Link to="/admin/product-variants">Quản lý biến thể</Link>,
    "6",
    <FileTextOutlined />
  ),
  getItem(
    <Link to="/admin/promotions">Quản lý khuyến mãi</Link>,
    "7",
    <FileTextOutlined />
  ),
  getItem(
    <Link to="/admin/blogs">Quản lý bài viết</Link>,
    "8",
    <FileTextOutlined />
  ),
  getItem(
    <Link to="/admin/statistics">Thống kê</Link>,
    "9",
    <PieChartOutlined />
  ),
];

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Admin</Breadcrumb.Item>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          </Breadcrumb>
          <Outlet /> {/* Vị trí hiển thị nội dung con */}
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Admin Dashboard ©{new Date().getFullYear()} Created by BEESHOP
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
