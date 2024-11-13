import { Button, Result } from "antd";
import React from "react";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const OrderSuccess: React.FC = () => {
  return (
    <Result
      style={{ marginTop: "30px", marginBottom: "30px" }}
      status="success"
      title="Đặt hàng thành công!"
      subTitle="Cảm ơn bạn đã mua sắm tại Bee Shop. Đơn hàng của bạn đã được ghi nhận và sẽ sớm được xử lý."
      extra={[
        <Link to={"/order-detail"}>
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
