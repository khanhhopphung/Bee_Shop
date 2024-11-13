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
import React from "react";

const OrderDetail = () => {
  const { Step } = Steps;

  const order = {
    orderId: "ORD123456",
    items: [
      { id: 1, name: "Sản phẩm A", price: 100000, quantity: 2 },
      { id: 2, name: "Sản phẩm B", price: 150000, quantity: 1 },
    ],
    shippingAddress: "123 Đường ABC, Quận 1, TP.HCM",
    totalAmount: 350000,
    paymentMethod: "Thanh toán khi nhận hàng",
    orderStatus: "Đang giao",
    estimatedDelivery: "Dự kiến giao vào ngày 15/11/2024",
  };

  return (
    <div className="order-detail-container">
      <h2>Chi tiết đơn hàng</h2>
      <div className="order-id">
        <strong>Mã đơn hàng: </strong>
        {order.orderId}
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
        {order.items.map((item) => (
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
          {order.shippingAddress}
        </p>
        <p>
          <strong>Thời gian giao dự kiến: </strong>
          {order.estimatedDelivery}
        </p>
      </div>

      {/* Thông tin thanh toán */}
      <div className="payment-info">
        <h4>Thanh toán</h4>
        <p>
          <strong>Tổng tiền: </strong>
          {order.totalAmount.toLocaleString()} VND
        </p>
        <p>
          <strong>Phương thức thanh toán: </strong>
          {order.paymentMethod}
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
