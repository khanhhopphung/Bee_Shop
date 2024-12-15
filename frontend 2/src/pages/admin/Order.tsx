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
  Space,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import { ColumnsType } from "antd/es/table";

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
  products: Product[];
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

type Product = {
  id: number;
  image_url: string;
  name: string;
  price: number;
  // Các trường khác của sản phẩm
};

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const [form] = Form.useForm();
  const handleTableChange = (paginationInfo: any) => {
    setPagination(paginationInfo);
  };

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
      // Sắp xếp đơn hàng mới nhất lên đầu

      const sortedOrders = data.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setOrders(sortedOrders);
      setFilteredOrders(sortedOrders);
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
        addresses.find((addr) => addr.id === order.address_id)?.address_line ||
        "";
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
  const handleStatusChange = async (newStatus: string, order_id: number) => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      message.error("Bạn chưa đăng nhập!");
      return;
    }

    // Kiểm tra trạng thái hiện tại của đơn hàng
    const currentOrder = orders.find((order) => order.id === order_id);
    if (!currentOrder) {
      message.error("Đơn hàng không tồn tại!");

      return;
    }

    if (currentOrder.status === "completed") {
      message.warning(
        "Không thể thay đổi trạng thái khi đơn hàng đã hoàn thành!"
      );
      return;
    }

    // Định nghĩa thứ tự trạng thái hợp lệ
    const statusOrder = [
      "pending",
      "on_hold",
      "processing",
      "shipped",
      "delivered",
      "returned",
      "refunded",
      "cancelled",
      "completed",
    ];
    const currentStatusIndex = statusOrder.indexOf(currentOrder.status);
    const newStatusIndex = statusOrder.indexOf(newStatus);

    // Kiểm tra trạng thái mới có hợp lệ không
    if (newStatusIndex <= currentStatusIndex) {
      message.error(" trạng thái không hợp lệ!");
      return;
    }
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/orders/${order_id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      message.success("Cập nhật trạng thái thành công!");

      // Cập nhật trạng thái trong danh sách đơn hàng cục bộ
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === order_id ? { ...order, status: newStatus } : order
        )
      );
      setFilteredOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === order_id ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      message.error("Cập nhật trạng thái thất bại!");
    }
  };

  const handleViewDetails = (orderId: number) => {
    const order = orders.find((order) => order.id === orderId);
    if (order) {
      const product = order.products?.[0]; // Giả sử bạn muốn hiển thị ảnh của sản phẩm đầu tiên
      const image_url = product ? product.image_url : null;

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
            {order.promotion_id && <p>Promotion: {order.promotion_id}</p>}
            <p>Active: {order.is_active ? "Yes" : "No"}</p>
          </div>
        ),
      });
    }
  };

  const columns: ColumnsType<Order> = [
    {
      title: <span style={{ fontSize: "18px", fontWeight: "bold" }}>STT</span>,
      key: "stt",
      render: (text: any, record: Order, index: number) => (
        <strong style={{ fontSize: "16px" }}>
          {index + 1 + (pagination.current - 1) * pagination.pageSize}
        </strong>
      ),
      align: "center",
    },

    {
      title: (
        <span style={{ fontSize: "18px", fontWeight: "bold" }}>
          Mã đơn hàng
        </span>
      ),
      dataIndex: "order_code",
      key: "order_code",
      render: (orderCode: string) => (
        <span style={{ fontSize: "16px" }}>{orderCode || "N/A"}</span>
      ),
      align: "left",
    },
    {
      title: (
        <span style={{ fontSize: "18px", fontWeight: "bold" }}>
          Tên người đặt
        </span>
      ),
      dataIndex: "user_id",
      key: "user_id",
      render: (userId: number) => (
        <span style={{ fontSize: "16px" }}>
          {users.find((user) => user.id === userId)?.username || "Unknown"}
        </span>
      ),
      align: "left",
    },

    {
      title: (
        <span style={{ fontSize: "18px", fontWeight: "bold" }}>
          Tổng đơn hàng
        </span>
      ),
      dataIndex: "total_amount",
      key: "total_amount",
      render: (totalAmount: number) => (
        <strong style={{ fontSize: "16px" }}>
          {totalAmount.toLocaleString()}₫
        </strong>
      ),
      align: "left",
    },

    // {
    //   title: (
    //     <span style={{ fontSize: "18px", fontWeight: "bold" }}>
    //       Phí vận chuyển
    //     </span>
    //   ),
    //   dataIndex: "shipping_cost",
    //   key: "shipping_cost",
    //   render: (shippingCost: number) => (
    //     <strong style={{ fontSize: "16px" }}>
    //       {shippingCost.toLocaleString()}₫
    //     </strong>
    //   ),
    //   align: "left",
    // },
    {
      title: (
        <span style={{ fontSize: "18px", fontWeight: "bold" }}>
          Phương thức thanh toán
        </span>
      ),
      dataIndex: "payment_method",
      key: "payment_method",
      render: (paymentMethod: string) => (
        <span style={{ fontSize: "16px" }}>{paymentMethod || "N/A"}</span>
      ),
      align: "left",
    },
    {
      title: (
        <span style={{ fontSize: "18px", fontWeight: "bold" }}>Địa chỉ</span>
      ),
      dataIndex: "address",
      key: "address",
      render: (address: { address_line: string }) => (
        <span style={{ fontSize: "16px" }}>
          {address?.address_line || "N/A"}
        </span>
      ),
      align: "left",
    },
    {
      title: (
        <span style={{ fontSize: "18px", fontWeight: "bold" }}>Khuyến mãi</span>
      ),
      dataIndex: "promotion",
      key: "promotion",
      render: (promotion: { code: string }) => (
        <span style={{ fontSize: "16px" }}>{promotion?.code || "N/A"}</span>
      ),
      align: "left",
    },
    {
      title: (
        <span style={{ fontSize: "18px", fontWeight: "bold" }}>
          Ngày đặt hàng
        </span>
      ),
      dataIndex: "order_date",
      key: "order_date",
      render: (orderDate: string) => (
        <span style={{ fontSize: "16px" }}>{orderDate || "N/A"}</span>
      ),
      align: "left",
    },
    {
      title: (
        <span style={{ fontSize: "18px", fontWeight: "bold" }}>Trạng thái</span>
      ),
      dataIndex: "status",
      key: "status",
      render: (status: string, record: Order) => (
        <Select
          value={status}
          style={{ width: 150 }}
          onChange={(value) => handleStatusChange(value, record.id)}
        >
          <Select.Option value="pending">Chờ xác nhận đơn hàng</Select.Option>
          <Select.Option value="on_hold">Tạm giữ</Select.Option>
          <Select.Option value="processing">Đang xử lý</Select.Option>
          <Select.Option value="shipped">Đã vận chuyển</Select.Option>
          <Select.Option value="delivered">Đã giao hàng</Select.Option>
          <Select.Option value="returned">Đã trả lại</Select.Option>
          <Select.Option value="refunded">Đã hoàn tiền</Select.Option>
          <Select.Option value="cancelled">Đã hủy</Select.Option>
          <Select.Option value="completed">Hoàn thành</Select.Option>
        </Select>
      ),
      align: "center",
    },

    {
      title: (
        <span style={{ fontSize: "18px", fontWeight: "bold" }}>Hành động</span>
      ),
      key: "actions",
      render: (record: Order) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record.id)}
          />
        </Space>
      ),
      align: "center",
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
      <div
        style={{
          background: "#fff",
          borderRadius: "8px",
          padding: "16px 24px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <Select
            placeholder="Lọc theo trạng thái"
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            allowClear
            style={{
              width: 250,
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Select.Option value="all">Tất cả trạng thái</Select.Option>
            <Select.Option value="pending">Đang giao</Select.Option>
            <Select.Option value="completed">Đã hoàn thành</Select.Option>
            <Select.Option value="cancelled">Đã hủy</Select.Option>
            <Select.Option value="processing">Đang xử lý</Select.Option>
            <Select.Option value="shipped">Đã gửi</Select.Option>
            <Select.Option value="delivered">Đã giao</Select.Option>
            <Select.Option value="returned">Đã trả lại</Select.Option>
            <Select.Option value="refunded">Đã hoàn tiền</Select.Option>
            <Select.Option value="on_hold">Tạm giữ</Select.Option>
          </Select>

          <Input.Search
            placeholder="Tìm kiếm bằng user, status, hoặc address"
            allowClear
            size="large"
            enterButton={<SearchOutlined />}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            style={{
              maxWidth: "600px",
              borderRadius: "8px",
              height: "48px",
            }}
          />
        </div>
        <hr />
        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          bordered
          pagination={{
            position: ["bottomCenter"],
            showSizeChanger: true,
            current: pagination.current,
            pageSize: pagination.pageSize,
          }}
          onChange={handleTableChange}
          scroll={{ x: "800" }}
          style={{
            fontSize: "16px",
            borderRadius: "8px",
            width: "100%",
          }}
        />
      </div>
    </div>
  );
};

export default Orders;
