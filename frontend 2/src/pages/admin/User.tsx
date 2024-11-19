import React, { useEffect, useState } from "react";
import { Table, Button, Input, Modal, Form, message, Switch } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";

interface User {
  id: number;
  username: string;
  password_hash?: string; // Optional, not used in the form but exists in the DB
  email: string;
  phone: string;
  role_id: number;
  tier_id: number;
  is_active: boolean;
  points_total: number;
  total_spent: number;
}

const UserPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [form] = Form.useForm();

  // Fetch user data
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/users");
      setUsers(response.data);
    } catch (error) {
      message.error("Lấy danh sách người dùng thất bại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle delete user (soft delete)
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/users/${id}`);
      message.success("Xóa người dùng thành công");
      fetchUsers(); // Refetch users after delete
    } catch (error) {
      message.error("Xóa người dùng thất bại");
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (user: User) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/users/${user.id}`, {
        ...user,
        is_active: !user.is_active,
      });
      message.success("Cập nhật trạng thái người dùng thành công");
      fetchUsers();
    } catch (error) {
      message.error("Cập nhật trạng thái người dùng thất bại");
    }
  };

  // Handle add/edit user
  const handleSubmit = async (values: any) => {
    try {
      const data = {
        username: values.username,
        email: values.email,
        phone: values.phone,
        role_id: values.role_id,
        tier_id: values.tier_id,
        is_active: values.is_active ?? true,
        points_total: values.points_total,
        total_spent: values.total_spent,
      };

      if (currentUser) {
        // Update existing user
        await axios.put(
          `http://127.0.0.1:8000/api/users/${currentUser.id}`,
          data
        );
        message.success("Cập nhật người dùng thành công");
      } else {
        // Create new user
        await axios.post("http://127.0.0.1:8000/api/register", data);
        message.success("Tạo người dùng thành công");
      }

      setIsModalVisible(false);
      fetchUsers(); // Refetch users after submit
      form.resetFields(); // Reset form fields
    } catch (error) {
      message.error("Lưu người dùng thất bại");
    }
  };  // Show modal for add/edit
  const handleAdd = () => {
    setCurrentUser(null);
    form.resetFields(); // Reset form fields for new user
    setIsModalVisible(true);
  };

  const handleEdit = (user: User) => {
    setCurrentUser(user);
    form.setFieldsValue(user); // Set form fields with user data
    setIsModalVisible(true);
  };

  // Filter users by search term
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Define table columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên người dùng",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Mã vai trò",
      dataIndex: "role_id",
      key: "role_id",
    },
    {
      title: "Mã cấp bậc",
      dataIndex: "tier_id",
      key: "tier_id",
    },
    {
      title: "Tổng điểm",
      dataIndex: "points_total",
      key: "points_total",
    },
    {
      title: "Tổng chi tiêu",
      dataIndex: "total_spent",
      key: "total_spent",
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      key: "is_active",
      render: (is_active: boolean, user: User) => (
        <Switch
          checked={is_active}
          onChange={() => handleStatusToggle(user)}
        />
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (user: User) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(user)}
            style={{ marginRight: 8 }}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(user.id)}
            danger
          />
        </>
      ),
    },
  ];

  return (
    <div>
      <Input.Search
        placeholder="Tìm kiếm người dùng theo tên"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 16, width: 300 }}
      />
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAdd}
        style={{ marginBottom: 16 }}
      >
        Thêm người dùng
      </Button>
      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="id"
        loading={loading}
      />
      <Modal
        open={isModalVisible}
        title={currentUser ? "Chỉnh sửa người dùng" : "Thêm người dùng"}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            name="username"
            label="Tên người dùng"
            rules={[{ required: true, message: "Vui lòng nhập tên người dùng" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email" label="Email"
            rules={[{ required: true, message: "Vui lòng nhập email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role_id"
            label="Mã vai trò"
            rules={[{ required: true, message: "Vui lòng nhập mã vai trò" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="tier_id"
            label="Mã cấp bậc"
            rules={[{ required: true, message: "Vui lòng nhập mã cấp bậc" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item name="points_total" label="Tổng điểm">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="total_spent" label="Tổng chi tiêu">
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="is_active"
            label="Trạng thái"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default UserPage;
