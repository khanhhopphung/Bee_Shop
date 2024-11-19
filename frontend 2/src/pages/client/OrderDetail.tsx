import {
  CheckCircleOutlined,
  DollarOutlined,
  GiftOutlined,
  HourglassOutlined,
  PauseCircleOutlined,
  StarOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { Steps } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Order {
  id: number;
  user_id: number;
  order_date: Date;
  total_amount: number;
  promotion_id: null;
  status: string;
  address_id: number;
  payment_method: string;
  shipping_cost: number;
  created_at: Date;
  updated_at: Date;
  order_code: string;
  order_details: [
    {
      id: number;
      order_id: number;
      product_id: number;
      variant_id: number;
      quantity: number;
      price: number;
      created_at: number;
      updated_at: number;
    }
  ];
  address: {
    id: number;
    user_id: number;
    recipient_name: string;
    phone: string;
    address_line: string;
    city: string;
    state: string;
    is_default: number;
    created_at: null;
    updated_at: number;
  };
}

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { Step } = Steps;
  const token = localStorage.getItem("access_token");

  const [order, setOrder] = useState<Order>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!id) {
        console.error("Không có orderId trong URL");
        return;
      }
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/orders/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Lỗi khi lấy thông tin đơn hàng");
        }
        const data = await response.json();
        setOrder(data.order);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };

    // Gọi API khi có orderId
    if (id) {
      fetchOrderDetails();
    }
  }, [id]); // Phụ thuộc vào orderId để thực hiện lại khi nó thay đổi

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (!order) return <div>Không tìm thấy đơn hàng.</div>;

  return (
    <div className="order-detail-container">
      <h2>Chi tiết đơn hàng</h2>
      <div className="order-id">
        <strong>Mã đơn hàng: </strong>
        {order.order_code}
      </div>

      {/* Thanh tiến trình */}
      <div className="progress-container">
        <Steps current={1}>
          <Step icon={<CheckCircleOutlined />} title="Đơn hàng đã đặt" />
          <Step
            icon={<DollarOutlined />}
            title="Đã xác nhận thông tin thanh toán"
          />
          <Step icon={<TruckOutlined />} title="Đã giao cho ĐVVC" />
          <Step icon={<GiftOutlined />} title="Chờ giao hàng" />
          <Step icon={<StarOutlined />} title="Đánh Giá" />
        </Steps>
      </div>

      {/* Thông tin đơn hàng */}
      <div className="order-items">
        <h4>Chi tiết sản phẩm</h4>
        {order &&
          order.order_details.map((item: any) => (
            <div key={item.id} className="order-item">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span className="item-price">
                {item.price.toLocaleString()} VND
              </span>
            </div>
          ))}
      </div>

      {/* Thông tin giao hàng */}
      <div className="shipping-info">
        <h4>Thông tin giao hàng</h4>
        <p>
          <strong>Địa chỉ: </strong>
          {order.address.address_line}
        </p>
        <p>
          <strong>Thời gian giao dự kiến: </strong>
          {order.created_at.toLocaleString("vi-VN", {
            weekday: "long", // Thứ (Thứ Hai)
            year: "numeric", // Năm (2024)
            month: "long", // Tháng (Tháng 11)
            day: "numeric", // Ngày (17)
            hour: "2-digit", // Giờ (10)
            minute: "2-digit", // Phút (00)
          })}
        </p>
      </div>

      {/* Thông tin thanh toán */}
      <div className="payment-info">
        <h4>Thanh toán</h4>
        <p>
          <strong>Tổng tiền: </strong>
          {order.total_amount.toLocaleString()} VND
        </p>
        <p>
          <strong>Phương thức thanh toán: </strong>
          {order.payment_method}
        </p>
      </div>

      {/* Chức năng liên hệ hỗ trợ */}
      <div className="contact-support">
        <button className="support-btn" onClick={() => alert("Liên hệ hỗ trợ")}>
          Liên hệ hỗ trợ
        </button>
      </div>
    </div>
  );
};

export default OrderDetail;
