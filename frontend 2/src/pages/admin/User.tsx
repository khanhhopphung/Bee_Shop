import React, { useEffect, useState } from "react";
import { Table, Button, Input, Modal, Form, message, Switch, Space } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined,  SearchOutlined} from "@ant-design/icons";
import axios from "axios";
import { ColumnsType } from 'antd/es/table';

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
    setLoading(true); // Đặt trạng thái loading trước khi bắt đầu
    try {
      const accessToken = localStorage.getItem("access_token");
  
      // Kiểm tra nếu không có token (nghĩa là người dùng chưa đăng nhập)
      if (!accessToken) {
        message.error("Bạn chưa đăng nhập!");
        setLoading(false); // Dừng trạng thái loading và thoát
        return;
      }
  
      // Thêm token vào header của yêu cầu
      const response = await axios.get("http://127.0.0.1:8000/api/users", {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Thêm token vào header
        },
      });
  
      setUsers(response.data); // Cập nhật danh sách người dùng vào state
    } catch (error) {
      message.error("Lấy danh sách người dùng thất bại");
    } finally {
      setLoading(false); // Kết thúc trạng thái loading
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
      fetchUsers(); 
      form.resetFields(); 
    } catch (error) {
      message.error("Lưu người dùng thất bại");
    }
  };  // Show modal for add/edit
  const handleAdd = () => {
    setCurrentUser(null);
    form.resetFields(); 
    setIsModalVisible(true);
  };

  const handleEdit = (user: User) => {
    setCurrentUser(user);
    form.setFieldsValue(user); 
    setIsModalVisible(true);
  };

  // Filter users by search term
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Define table columns
  const columns: ColumnsType<User> = [
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>ID</span>,
      dataIndex: "id",
      key: "id",
      render: (text: any) => <span style={{ fontSize: '16px' }}>{text}</span>,
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Tên người dùng</span>,
      dataIndex: "username",
      key: "username",
      render: (text: string) => <span style={{ fontSize: '16px' }}>{text}</span>,
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Email</span>,
      dataIndex: "email",
      key: "email",
      render: (text: string) => <span style={{ fontSize: '16px' }}>{text}</span>,
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Số điện thoại</span>,
      dataIndex: "phone",
      key: "phone",
      render: (text: string) => <span style={{ fontSize: '16px' }}>{text}</span>,
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Mã vai trò</span>,
      dataIndex: "role_id",
      key: "role_id",
      render: (text: string) => <span style={{ fontSize: '16px' }}>{text}</span>,
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Mã cấp bậc</span>,
      dataIndex: "tier_id",
      key: "tier_id",
      render: (text: string) => <span style={{ fontSize: '16px' }}>{text}</span>,
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Tổng điểm</span>,
      dataIndex: "points_total",
      key: "points_total",
      render: (text: number) => <span style={{ fontSize: '16px' }}>{text}</span>,
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Tổng chi tiêu</span>,
      dataIndex: "total_spent",
      key: "total_spent",
      render: (text: number) => <span style={{ fontSize: '16px' }}>{text}</span>,
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Trạng thái</span>,
      dataIndex: "is_active",
      key: "is_active",
      render: (is_active: boolean, user: User) => (
        <Switch
          checked={is_active}
          onChange={() => handleStatusToggle(user)}
        />
      ),
      align: 'center',
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Hành động</span>,
      key: "actions",
      render: (user: User) => (
        <Space>
          <Button
            type="primary"
            size="large"
            icon={<EditOutlined />}
            onClick={() => handleEdit(user)}
            style={{ marginRight: 8 }}
          />
          <Button
            type="primary"
            danger
            size="large"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(user.id)}

          />
        </Space>
      ),
      align: 'center',
    },
  ];


  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <div
        style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '16px 24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            style={{ fontSize: '16px', height: '40px' }}
          >
            Thêm người dùng
          </Button>

          <Input.Search
            placeholder="Tìm kiếm người dùng theo tên"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              maxWidth: '600px',
              borderRadius: '8px',
              height: '48px',
            }}
          />
        </div>
        <hr />
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          bordered
          pagination={{ position: ['bottomCenter'], showSizeChanger: true }}
          style={{
            fontSize: '16px',
            borderRadius: '8px',
          }}
        />
      </div>
      <Modal
        open={isModalVisible}
        title={<span style={{ fontSize: '20px', fontWeight: 'bold' }}>{currentUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}</span>}

        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        centered

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
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserPage;
