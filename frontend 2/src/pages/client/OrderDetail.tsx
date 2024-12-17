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
import Pusher from "pusher-js";

interface Order {
  id: number;
  user_id: number;
  order_date: string;
  total_amount: string;
  promotion_id: number | null;
  status: string;
  address_id: number;
  payment_method: string;
  shipping_cost: string;
  final_amount: string;
  discount_amount: string;
  shipping_discount: string;
  created_at: string;
  updated_at: string;
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
    is_default: number;
    created_at: string;
    updated_at: string;
    is_active: number;
  };
  is_active: number;
  promotion: any | null;
  order_details: {
    id: number;
    order_id: number;
    product_id: number;
    variant_id: number;
    quantity: number;
    price: string;
    created_at: string;
    updated_at: string;
    product: {
      id: number;
      name: string;
      sku: string;
      description: string;
      category_id: number;
      stock: number;
      price: string | null;
      is_active: number;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
    };
    product_variant: {
      id: number;
      product_id: number;
      size_id: number;
      color_id: number;
      price: string;
      stock: number;
      is_active: number;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
      images: {
        id: number;
        product_id: number;
        variant_id: number;
        alt_text: string | null;
        image_url: string;
        is_active: number;
        created_at: string;
        updated_at: string;
      }[];
      color: {
        id: number;
        color_name: string;
        created_at: string | null;
        updated_at: string | null;
        is_active: number;
      };
      size: {
        id: number;
        size_name: string;
        created_at: string | null;
        updated_at: string | null;
        is_active: number;
      };
    };
  }[];
}

const OrderDetail = () => {
  const { Step } = Steps;
  const { Title, Text } = Typography;
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order>();
  const [loading, setLoading] = useState(true);
  const [load, setLoad] = useState("");

  useEffect(() => {
    console.log("Bắt đầu ... load");
    Pusher.logToConsole = true;
    const pusher = new Pusher("07bc45f6a417f8745a02", {
      cluster: "ap1",
    });
    const channel = pusher.subscribe("new");
    channel.bind("load", (data: any) => {
      console.log(data.code);
      setLoad(data.code);
    });
    return () => {
      pusher.unsubscribe("product");
    };
  }, []);
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/get-one-order/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        const data = await response.json();
        console.log(data); // Kiểm tra dữ liệu nhận được
        if (data && data.data) {
          setOrder(data.data);
        } else {
          console.error("Không có dữ liệu đơn hàng");
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [load]);

  if (loading) return <div>Đang tải dữ liệu...</div>;
  // if (!order) return <div>Không tìm thấy đơn hàng.</div>;
  console.log(order);

  return (
    <>
      {order && (
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
            <Step title="Hủy" icon={<PauseCircleOutlined />} />
          </Steps>

          {/* Thông tin chi tiết sản phẩm */}
          <Title level={4}>Sản phẩm</Title>
          <div>
            {order.order_details.map((item) => (
              <Card key={item.id} style={{ marginBottom: "20px" }}>
                <Space align="center">
                  <img
                    src={`http://127.0.0.1:8000/storage/${item.product_variant.images[0]?.image_url}`}
                    alt={item.product.name}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <Text>
                      <strong>{item.product.name}</strong>
                    </Text>
                    <div>Số lượng: {item.quantity}</div>
                    <div>
                      Size: {item.product_variant.size.size_name}, Màu:{" "}
                      {item.product_variant.color.color_name}
                    </div>
                  </div>
                  <Text strong>
                    {(Number(item.price) || 0).toLocaleString()} VND
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
              <strong>Địa chỉ:</strong>{" "}
              {`${order.address.address_line}, ${order.address.city}, ${order.address.state}`}
            </p>
          </Card>

          {/* Thông tin thanh toán */}
          <Title level={4}>Thanh toán</Title>
          <Card>
            <p>
              <strong>Tổng tiền: </strong>{" "}
              {(Number(order.total_amount) || 0).toLocaleString()} VND
            </p>
            <p>
              <strong>Phí vận chuyển: </strong>{" "}
              {(Number(order.shipping_cost) || 0).toLocaleString()} VND
            </p>
            {Number(order.discount_amount) > 0 && (
              <p>
                <strong>Giảm giá: </strong>-{" "}
                {(Number(order.discount_amount) || 0).toLocaleString()} VND
              </p>
            )}
            {Number(order.shipping_discount) > 0 && (
              <p style={{ display: "block" }}>
                <strong>Giảm giá: </strong>-{" "}
                {(Number(order.shipping_discount) || 0).toLocaleString()} VND
              </p>
            )}

            <p style={{ color: "red" }}>
              <strong>Tổng thanh toán: </strong>
              {(Number(order.final_amount) || 0).toLocaleString()} VND
            </p>
            <p>
              <strong>Phương thức thanh toán:</strong> {order.payment_method}
            </p>
          </Card>

          {/* Chức năng hỗ trợ */}
          <Divider />
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            {/* <Button type="primary" onClick={() => alert("Liên hệ hỗ trợ")}>
              Liên hệ hỗ trợ
            </Button> */}
          </div>
        </div>
      )}
    </>
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
    case "cancelled":
      return 5;
    default:
      return 0;
  }
};

export default OrderDetail;
