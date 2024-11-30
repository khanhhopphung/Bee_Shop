import React, { useState } from "react";
import { Form, Input, Button, InputNumber, message } from "antd";

const VNPayForm: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/vnpay/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.paymentUrl; // Redirect to VNPay
      } else {
        message.error("Thanh toán thất bại! Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Có lỗi xảy ra khi kết nối với VNPay.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "50px auto",
        padding: 20,
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>
        Thanh Toán VNPay
      </h2>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
        >
          <Input placeholder="Nhập họ và tên" />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
            { pattern: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ!" },
          ]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
        >
          <Input placeholder="Nhập địa chỉ giao hàng" />
        </Form.Item>

        <Form.Item
          label="Số tiền (VND)"
          name="amount"
          rules={[
            { required: true, message: "Vui lòng nhập số tiền!" },
            {
              type: "number",
              min: 1000,
              message: "Số tiền phải lớn hơn 1.000 VND",
            },
          ]}
        >
          <InputNumber
            placeholder="Nhập số tiền"
            style={{ width: "100%" }}
            formatter={(value) =>
              `${value}₫`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value!.replace(/\₫\s?|(,*)/g, "")}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            style={{ marginTop: 10 }}
          >
            Thanh toán ngay
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default VNPayForm;
