import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Select,
  InputNumber,
  Switch,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";

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
  address: string;
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
          Authorization: `Bearer ${accessToken}`, // Gửi token trong header Authorization
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
        addresses.find((addr) => addr.id === order.address_id)?.address || "";
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
      setFilteredOrders(orders); // Hiển thị tất cả đơn hàng
    } else {
      const filtered = orders.filter((order) => order.status === statusFilter);
      setFilteredOrders(filtered);
    }
  }, [statusFilter, orders]);

  const handleEdit = (order: Order) => {
    setCurrentOrder(order);
    setIsModalVisible(true);
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
          Authorization: `Bearer ${accessToken}`, // Send token in the Authorization header
        },
      });
      message.success("Order deleted successfully");

      fetchOrders(); // Refresh the list
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
              Authorization: `Bearer ${accessToken}`, // Send token in the Authorization header
            },
          }
        );
        message.success("sửa thành công");

        fetchOrders(); // Refresh orders after updating
      }
      setIsModalVisible(false);
    } catch (error) {
      message.error("sửa thất bại");
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
                ?.address || "N/A"}
            </p>
            <p>Active: {order.is_active ? "Yes" : "No"}</p>
          </div>
        ),
      });
    }
  };

  const columns = [
    
   
    {
      title: 'STT',
      dataIndex: 'id',
      key: 'id',
      render: (text: any, record: Order, index: number) => index + 1,
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "order_code",
      key: "order_code",
      render: (orderCode: string) => orderCode || "N/A", // Hiển thị "N/A" nếu không có mã
    },

    
  {
      title: "Tên người đặt",
      dataIndex: "user_id",
      key: "user_id",
      render: (userId: number) =>
        users.find((user) => user.id === userId)?.username || "Unknown",
    },
    { title: "ngày đặt hàng", dataIndex: "order_date", key: "order_date" },
    { title: "tổng đơn hàng", dataIndex: "total_amount", key: "total_amount" },
    { title: "trạng thái ", dataIndex: "status", key: "status" },
    {
      title: "phí vận chuyển",
      dataIndex: "shipping_cost",
      key: "shipping_cost",
    },
    {
      title: "phương thức thanh toán ",
      dataIndex: "payment_method",
      key: "payment_method",
    },
    {
      title: "mã khuyến mãi",
      dataIndex: "promotion_id",
      key: "promotion_id",
      render: (promoId: number) => {
        const promo = promotions.find((p) => p.id === promoId);
        return promo ? promo.code : "N/A";
      },
    },
    {
      title: "địa chỉ ",
      dataIndex: "address_id",
      key: "address_id",
      render: (addressId: number) => {
        const address = addresses.find((address) => address.id === addressId);
        return address ? address.address : "N/A";
      },
    },
    {
      title: "trạng thái hoạt động ",
      dataIndex: "is_active",
      key: "is_active",
      render: (isActive: boolean) => (isActive ? "Yes" : "No"),
    },
    {
      title: "hành động ",
      key: "actions",
      render: (record: Order) => (
        <>
          <Button
            onClick={() => handleEdit(record)}
            icon={<EditOutlined />}
            style={{ marginRight: 8 }}
          />
          <Button
            onClick={() => handleDelete(record.id)}
            icon={<DeleteOutlined />}
            danger
            style={{ marginRight: 8 }}
          />
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record.id)}
          />
        </>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        
        <Input
          placeholder="tìm kiếm bằnguser, status, hoặc address"
          prefix={<SearchOutlined />}
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </div>
      <Select
  placeholder="lọc  status"
  value={statusFilter}
  onChange={(value) => setStatusFilter(value)}
  style={{ width: 200, marginBottom: 20 }}
>
  <Select.Option value="all"> tất cả trạng thái</Select.Option>
  <Select.Option value="pending">đang giao</Select.Option>
  <Select.Option value="completed">đã hoàn thành</Select.Option>
  <Select.Option value="canceled">đã hủy</Select.Option>
</Select>


      <Table
        columns={columns}
        dataSource={filteredOrders}
        rowKey="id"
        loading={loading}
      />

      {/* Modal for editing order */}
      <Modal
        title="Sửa đơn hàng"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => currentOrder && form.submit()}
      >
        <Form
          form={form}
          initialValues={
            currentOrder
              ? {
                  order_date: moment(currentOrder.order_date),
                  order_code: currentOrder.order_code ,
                  total_amount: currentOrder.total_amount,
                  shipping_cost: currentOrder.shipping_cost,
                  payment_method: currentOrder.payment_method,
                  status: currentOrder.status,
                  promotion_id: currentOrder.promotion_id,
                  address_id: currentOrder.address_id,
                  is_active: currentOrder.is_active,
                }
              : {}
          }
          onFinish={handleSubmit}
        >
          <Form.Item
            name="order_date"
            label="ngày đặt hàng"
            rules={[{ required: true }]}
          >
            <Input />
            </Form.Item>
            <Form.Item
      name="order_code"
      label="mã đơn hàng"
      rules={[{ required: true, message: "Please input the order code!" }]}
>
  <Input />
</Form.Item>
           
        
          <Form.Item
            name="total_amount"
            label="tổng đơn hàng"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item
            name="shipping_cost"
            label="phí vận chuyển"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item
            name="payment_method"
            label="phương thức thanh toán"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
  name="status"
  label="Trạng thái"
  rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
>
  <Select placeholder="Chọn trạng thái">
    <Select.Option value="pending">Đang xử lý</Select.Option>
    <Select.Option value="completed">Hoàn thành</Select.Option>
    <Select.Option value="cancelled">Đã hủy</Select.Option>
  </Select>
</Form.Item>
          <Form.Item name="promotion_id" label="khuyến mãi">
            <Select>
              {promotions.map((promo) => (
                <Select.Option key={promo.id} value={promo.id}>
                  {promo.code}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="address_id"
            label="địa chỉ"
            rules={[{ required: true }]}
          >
            <Select>
              {addresses.map((address) => (
                <Select.Option key={address.id} value={address.id}>
                  {address.address}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="is_active" label="trạng thái hoạt động " valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Orders;
