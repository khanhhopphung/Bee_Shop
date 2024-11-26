import React, { useEffect, useState } from "react";
import {Table,Button,Modal,Form,Input,message,Select,InputNumber,Switch,Space} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import { ColumnsType } from 'antd/es/table';

// Define the types for Order, User, Address, and Promotion
interface Order {
  id: number;
  user_id: number;
  order_code: string;
  order_date: string;
  total_amount: number;
  shipping_cost: number;
  payment_method: string;
  promotion_id: number | null;
  address_id: number;
  is_active: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Promotion {
  id: number;
  code: string;
}

interface User {
  id: number;
  username: string;
}

interface Address {
  id: number;
  address_line: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const [form] = Form.useForm();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        message.error("Bạn chưa đăng nhập!");
        return;
      }

      const response = await axios.get("http://127.0.0.1:8000/api/orders", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = Array.isArray(response.data) ? response.data : [];
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      message.error("Lỗi khi tải đơn hàng.");
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPromotions = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/promotions");
      const data = Array.isArray(response.data) ? response.data : [];
      setPromotions(data);
    } catch (error) {
      message.error("Failed to load promotions");
      setPromotions([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/users");
      const data = Array.isArray(response.data) ? response.data : [];
      setUsers(data);
    } catch (error) {
      message.error("Failed to load users");
      setUsers([]);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/addresses");
      const data = Array.isArray(response.data) ? response.data : [];
      setAddresses(data);
    } catch (error) {
      message.error("Failed to load addresses");
      setAddresses([]);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchPromotions();
    fetchUsers();
    fetchAddresses();
  }, []);

  useEffect(() => {
    const lowerKeyword = searchKeyword.toLowerCase();
    const filtered = orders.filter((order) => {
      const userName =
        users.find((user) => user.id === order.user_id)?.username || "";
      const address =
        addresses.find((addr) => addr.id === order.address_id)?.address_line || "";
      return (
        userName.toLowerCase().includes(lowerKeyword) ||
        order.status.toLowerCase().includes(lowerKeyword) ||
        address.toLowerCase().includes(lowerKeyword)
      );
    });
    setFilteredOrders(filtered);
  }, [searchKeyword, orders, users, addresses]);

  useEffect(() => {
    if (statusFilter === "all" || !statusFilter) {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) => order.status === statusFilter);
      setFilteredOrders(filtered);
    }
  }, [statusFilter, orders]);

  const handleEdit = (order: Order) => {
    setCurrentOrder(order);
    setIsModalVisible(true);
    form.setFieldsValue({
      order_date: moment(order.order_date),
      order_code: order.order_code,
      total_amount: order.total_amount,
      shipping_cost: order.shipping_cost,
      payment_method: order.payment_method,
      status: order.status,
      promotion_id: order.promotion_id,
      address_id: order.address_id,
      is_active: order.is_active,
    });
  };

  const handleDelete = async (id: number) => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      message.error("Bạn chưa đăng nhập!");
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:8000/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      message.success("Order deleted successfully");
      fetchOrders();
    } catch (error) {
      message.error("Failed to delete order");
    }
  };

  const handleSubmit = async (values: any) => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      message.error("Bạn chưa đăng nhập!");
      return;
    }

    try {
      if (currentOrder) {
        await axios.put(
          `http://127.0.0.1:8000/api/orders/${currentOrder.id}`,
          values,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        message.success("Cập nhật thành công");
        fetchOrders(); // Refresh orders after updating
      }
      setIsModalVisible(false);
    } catch (error) {
      message.error("Cập nhật thất bại");
    }
  };

  const handleViewDetails = (orderId: number) => {
    const order = orders.find((order) => order.id === orderId);
    if (order) {
      Modal.info({
        title: "Order Details",
        content: (
          <div>
            <p>Order ID: {order.id}</p>
            <p>
              User: {users.find((user) => user.id === order.user_id)?.username}
            </p>
            <p>Order Date: {order.order_date}</p>
            <p>Status: {order.status}</p>
            <p>Total Amount: {order.total_amount}</p>
            <p>Shipping Cost: {order.shipping_cost}</p>
            <p>Payment Method: {order.payment_method}</p>
            {order.promotion_id && (
              <p>
                Promotion:{" "}
                {promotions.find((promo) => promo.id === order.promotion_id)
                  ?.code || "N/A"}
              </p>
            )}
            <p>
              Address:{" "}
              {addresses.find((address) => address.id === order.address_id)
                ?.address_line || "N/A"}
            </p>
            <p>Active: {order.is_active ? "Yes" : "No"}</p>
          </div>
        ),
      });
    }
  };

  const columns: ColumnsType<Order> = [
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>STT</span>,
      dataIndex: 'id',
      key: 'id',
      render: (text: any, record: Order, index: number) => (
        <strong style={{ fontSize: '16px' }}>{index + 1}</strong>
      ),
      align: 'center',
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Mã đơn hàng</span>,
      dataIndex: 'order_code',
      key: 'order_code',
      render: (orderCode: string) => (
        <span style={{ fontSize: '16px' }}>{orderCode || 'N/A'}</span>
      ),
      align: 'left',
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Tên người đặt</span>,
      dataIndex: 'user_id',
      key: 'user_id',
      render: (userId: number) => (
        <span style={{ fontSize: '16px' }}>
          {users.find((user) => user.id === userId)?.username || 'Unknown'}
        </span>
      ),
      align: 'left',
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Ngày đặt hàng</span>,
      dataIndex: 'order_date',
      key: 'order_date',
      render: (orderDate: string) => (
        <span style={{ fontSize: '16px' }}>{orderDate || 'N/A'}</span>
      ),
      align: 'left',
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Tổng đơn hàng</span>,
      dataIndex: 'total_amount',
      key: 'total_amount',
      render: (totalAmount: number) => (
        <span style={{ fontSize: '16px' }}>{totalAmount || 'N/A'}</span>
      ),
      align: 'left',
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Trạng thái</span>,
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span style={{ fontSize: '16px' }}>{status || 'N/A'}</span>
      ),
      align: 'left',
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Phí vận chuyển</span>,
      dataIndex: 'shipping_cost',
      key: 'shipping_cost',
      render: (shippingCost: number) => (
        <span style={{ fontSize: '16px' }}>{shippingCost || 'N/A'}</span>
      ),
      align: 'left',
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Phương thức thanh toán</span>,
      dataIndex: 'payment_method',
      key: 'payment_method',
      render: (paymentMethod: string) => (
        <span style={{ fontSize: '16px' }}>{paymentMethod || 'N/A'}</span>
      ),
      align: 'left',
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Địa chỉ</span>,
      dataIndex: 'address',
      key: 'address',
      render: (address: { id: string }) => (
        <span style={{ fontSize: '16px' }}>{address?.id || 'N/A'}</span>
      ),
      align: 'left',
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Khuyến mãi</span>,
      dataIndex: 'promotion',
      key: 'promotion',
      render: (promotion: { code: string }) => (
        <span style={{ fontSize: '16px' }}>{promotion?.code || 'N/A'}</span>
      ),
      align: 'left',
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Trạng thái hoạt động</span>,
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean) => (
        <span
          style={{
            fontSize: '16px',
            color: isActive ? '#3f8600' : '#cf1322',
            fontWeight: 'bold',
          }}
        >
          {isActive ? 'Yes' : 'No'}
        </span>
      ),
      align: 'center',
    },
    {
      title: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Hành động</span>,
      key: 'actions',
      render: (record: Order) => (
        <Space>
          <Button
            type="primary"
            size="large"
            onClick={() => handleEdit(record)}
            icon={<EditOutlined />}
          />
          <Button
            type="primary"
            danger
            size="large"
            onClick={() => handleDelete(record.id)}
            icon={<DeleteOutlined />}
          />
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record.id)}
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
          <Select
            placeholder="Lọc theo trạng thái"
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            allowClear
            style={{
              width: 250,
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Select.Option value="all">Tất cả trạng thái</Select.Option>
            <Select.Option value="pending">Đang giao</Select.Option>
            <Select.Option value="completed">Đã hoàn thành</Select.Option>
            <Select.Option value="canceled">Đã hủy</Select.Option>
          </Select>

          <Input.Search
            placeholder="Tìm kiếm bằng user, status, hoặc address"
            allowClear
            size="large"
            enterButton={<SearchOutlined />}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}

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
          dataSource={filteredOrders}
          rowKey="id"
          bordered
          pagination={{ position: ['bottomCenter'], showSizeChanger: true }}
          style={{
            fontSize: '16px',
            borderRadius: '8px',
          }}
        />
      </div>

      {/* Modal for editing order */}
      <Modal
        title={<span style={{ fontSize: '20px', fontWeight: 'bold' }}>Chỉnh sửa đơn hàng</span>}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields(); // Ensure form resets when closed
        }}
        footer={null}
        centered
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="order_date"
            label="Ngày đặt hàng"
            rules={[{ required: true, message: 'Vui lòng nhập ngày đặt hàng!' }]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="order_code"
            label="Mã đơn hàng"
            rules={[{ required: true, message: 'Vui lòng nhập mã đơn hàng!' }]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="total_amount"
            label="Tổng đơn hàng"
            rules={[{ required: true, message: 'Vui lòng nhập tổng đơn hàng!' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} disabled />
          </Form.Item>

          <Form.Item
            name="shipping_cost"
            label="Phí vận chuyển"
            rules={[{ required: true, message: 'Vui lòng nhập phí vận chuyển!' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} disabled />
          </Form.Item>

          <Form.Item
            name="payment_method"
            label="Phương thức thanh toán"
            rules={[{ required: true, message: 'Vui lòng nhập phương thức thanh toán!' }]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value="pending">Đang xử lý</Select.Option>
              <Select.Option value="completed">Hoàn thành</Select.Option>
              <Select.Option value="canceled">Đã hủy</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="promotion_id"
            label="Khuyến mãi"
            rules={[{ required: true, message: 'Vui lòng chọn khuyến mãi!' }]}
          >
            <Select disabled>
              {promotions.map((promo) => (
                <Select.Option key={promo.id} value={promo.id}>
                  {promo.code}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="address_id"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng chọn địa chỉ!' }]}
          >
            <Select disabled>
              {addresses.map((address) => (
                <Select.Option key={address.id} value={address.id}>
                  {address.address_line}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="is_active"
            label="Trạng thái hoạt động"
            valuePropName="checked"
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

export default Orders;