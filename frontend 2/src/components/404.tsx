import { Button, Result } from "antd";
import React from "react";
import { Link } from "react-router-dom";

type Props = {};

const NotFound: React.FC = () => {
  return (
    <Result
      status="500"
      title="404 Not Found"
      subTitle="Rất tiếc, trang bạn đã truy cập không tồn tại."
      extra={
        <Link to={"/"}>
          <Button type="primary">Quay về trang chủ</Button>
        </Link>
      }
    />
  );
};

export default NotFound;
