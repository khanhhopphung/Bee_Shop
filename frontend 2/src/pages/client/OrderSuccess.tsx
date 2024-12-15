import { Button, message, Result } from "antd";
import React, { useEffect, useState } from "react";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

interface Res {
  status: boolean; //
  message: string;
  data: Cart;
}
interface Cart {
  id: number;
  cart_id: number;
  product_id: number;
  variant_id: number | null;
  quantity: number;
  product_price: string;
  discount_value: string;
  product: {
    id: number;
    name: string;
    sku: string;
    description: string;
    category_id: number;
    stock: number;
    // price: number;
    is_active: number;
    image: {
      id: number;
      product_id: number;
      variant_id: number;
      alt_text: string;
      image_url: string;
    };
  };
  product_variant: {
    id: number;
    product_id: number;
    size_id: number;
    color_id: number;
    price: number;
    stock: number;
    size: {
      id: number;
      size_name: string;
    };
    color: {
      id: number;
      color_name: string;
    };
  };
}
const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const token = localStorage.getItem("access_token");
  const orderData = localStorage.getItem("orderData");
  console.log(orderData);
  const [res, setRes] = useState<Res>();

  const handlePaymentStatus = async () => {
    // try {
    const urlParams = new URLSearchParams(window.location.search);
    const vnp_ResponseCode = urlParams.get("vnp_ResponseCode"); // Mã phản hồi giao dịch

    if (vnp_ResponseCode == "00") {
      const parsedOrderData = JSON.parse(
        localStorage.getItem("orderData") || "{}"
      );
      console.log("Order Data to Send:", parsedOrderData);

      const response = await fetch(`http://127.0.0.1:8000/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(parsedOrderData),
      });

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      const res = await response.json();
      setRes(res);
      console.log("Response from server:", res);
    }
    // } catch (error) {
    //   console.error("Error during payment status check:", error);
    //   navigate(`/payment`);
    // }
  };

  // Gọi hàm handlePaymentStatus khi trang được tải lại (URL callback)
  React.useEffect(() => {
    if (window.location.search) {
      handlePaymentStatus(); // Kiểm tra trạng thái thanh toán
    }
  }, []);

  return (
    <Result
      style={{ marginTop: "30px", marginBottom: "30px" }}
      status="success"
      title="Đặt hàng thành công!"
      subTitle="Cảm ơn bạn đã mua sắm tại Bee Shop. Đơn hàng của bạn đã được ghi nhận và sẽ sớm được xử lý."
      extra={[
        <Link to={`/order-detail/${res?.data?.id ?? id}`}>
          <Button type="primary" key="console">
            Xem chi tiết đơn hàng
          </Button>
        </Link>,
        <Link to={"/"}>
          <Button key="buy">Tiếp tục mua sắm</Button>
        </Link>,
      ]}
    />
  );
};

export default OrderSuccess;
