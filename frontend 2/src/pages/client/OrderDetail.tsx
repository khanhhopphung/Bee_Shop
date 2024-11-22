import {
  CheckCircleOutlined,
  DollarOutlined,
  GiftOutlined,
  HourglassOutlined,
  PauseCircleOutlined,
  StarOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { Steps, Button, Card, Typography, Space, Divider } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Order {
  id: number;
  user_id: number;
  order_date: string;
  total_amount: string;
  promotion_id: null | number;
  status: string;
  address_id: number;
  payment_method: string;
  shipping_cost: string;
  order_code: string;
  name: string;
  phone: string;
  address: {
    id: number;
    user_id: number;
    recipient_name: string;
    phone: string;
    address_line: string;
    city: string;
    state: string;
  };
  order_details: {
    id: number;
    order_id: number;
    product_id: number;
    variant_id: number;
    quantity: number;
    price: string;
  }[];
}

const OrderDetail = () => {
  const { Step } = Steps;
  const { Title, Text } = Typography;
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        const data = await response.json();
        setOrder(data.order);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrderDetails();
  }, [id]);

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (!order) return <div>Không tìm thấy đơn hàng.</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
      <Title level={2} style={{ marginBottom: "20px" }}>
        Chi tiết đơn hàng
      </Title>

      {/* Mã đơn hàng */}
      <Card style={{ marginBottom: "20px" }}>
        <Text>
          <strong>Mã đơn hàng:</strong> {order.order_code}
        </Text>
      </Card>

      {/* Thanh tiến trình */}
      <Steps
        current={getStatusIndex(order.status)}
        style={{ marginBottom: "40px" }}
      >
        <Step title="Đã đặt hàng" icon={<CheckCircleOutlined />} />
        <Step title="Đã xác nhận" icon={<DollarOutlined />} />
        <Step title="Đang giao hàng" icon={<TruckOutlined />} />
        <Step title="Hoàn tất" icon={<GiftOutlined />} />
        <Step title="Đánh giá" icon={<StarOutlined />} />
      </Steps>

      {/* Thông tin chi tiết sản phẩm */}
      <Title level={4}>Sản phẩm</Title>
      <div>
        {order.order_details.map((item) => (
          <Card key={item.id} style={{ marginBottom: "20px" }}>
            <Space align="center">
              <img
                // src={item.image?.image_url || "default-image-url.png"}
                // alt={item.name}
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <div style={{ flex: 1 }}>
                <Text>
                  <strong>{item.product_id}</strong>
                </Text>
                <div>Số lượng: {item.quantity}</div>
              </div>
              <Text strong>
                {(Number(item.price) || 0).toLocaleString()} VND VND
              </Text>
            </Space>
          </Card>
        ))}
      </div>

      {/* Thông tin giao hàng */}
      <Title level={4}>Thông tin giao hàng</Title>
      <Card style={{ marginBottom: "20px" }}>
        <p>
          <strong>Người nhận:</strong> {order.name}
        </p>
        <p>
          <strong>Số điện thoại:</strong> {order.phone}
        </p>
        <p>
          <strong>Địa chỉ:</strong> {`${order.address}`}
        </p>
      </Card>

      {/* Thông tin thanh toán */}
      <Title level={4}>Thanh toán</Title>
      <Card>
        <p>
          <strong>Tổng tiền:</strong>{" "}
          {(Number(order.total_amount) || 0).toLocaleString()} VND
        </p>
        <p>
          <strong>Phương thức:</strong> {order.payment_method}
        </p>
      </Card>

      {/* Chức năng hỗ trợ */}
      <Divider />
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Button type="primary" onClick={() => alert("Liên hệ hỗ trợ")}>
          Liên hệ hỗ trợ
        </Button>
      </div>
    </div>
  );
};

const getStatusIndex = (status: string) => {
  switch (status) {
    case "pending":
      return 0;
    case "confirmed":
      return 1;
    case "shipping":
      return 2;
    case "delivered":
      return 3;
    case "completed":
      return 4;
    default:
      return 0;
  }
};

export default OrderDetail;
