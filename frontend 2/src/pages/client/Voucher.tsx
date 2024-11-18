import { CopyOutlined, EditOutlined, UserOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  CheckboxProps,
  Col,
  Input,
  Row,
  Space,
  Tag,
} from "antd";
import React, { useState } from "react";

const vouchers = [
  {
    id: 1,
    code: "DISCOUNT10",
    description: "Giảm 10% cho đơn hàng",
    status: "active",
  },
  {
    id: 2,
    code: "FREESHIP",
    description: "Miễn phí vận chuyển",
    status: "expired",
  },
  {
    id: 3,
    code: "NEWUSER",
    description: "Giảm giá cho người mới",
    status: "used",
  },
  { id: 4, code: "SUMMER20", description: "Giảm 20% mùa hè", status: "active" },
];
// Hàm lọc voucher theo mã hoặc mô tả

const Voucher: React.FC = () => {
  const onChange: CheckboxProps["onChange"] = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };
  const [search, setSearch] = useState("");

  const filteredVouchers = vouchers.filter(
    (voucher) =>
      voucher.code.toLowerCase().includes(search.toLowerCase()) ||
      voucher.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    alert("Đã sao chép mã: " + code);
  };
  return (
    <div className="account-page">
      <div className="account-content">
        <div className="menu">
          <div style={{ display: "flex", alignItems: "center" }}>
            <i
              className="fa-solid fa-circle-user"
              style={{ marginLeft: "5px", fontSize: "40px" }}
            ></i>
            <div className="profile-details" style={{ marginLeft: "10px" }}>
              <h3>Username</h3>

              <p>
                {" "}
                <EditOutlined /> Sửa hồ sơ
              </p>
            </div>
          </div>

          <ul>
            <li>
              <a href="/account">
                <i
                  className="fa-solid fa-user"
                  style={{ color: "#B197FC", marginRight: "10px" }}
                ></i>
                Tài khoản của tôi
              </a>
              <ul style={{ marginLeft: "30px" }}>
                <li>
                  <a href="/account">Hồ sơ</a>
                </li>
                <li>
                  <a href="/update-password">Đổi Mật Khẩu</a>
                </li>
                <li>
                  <a href="/adrress">Địa Chỉ</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="#">
                <i
                  className="fa-solid fa-clipboard-list"
                  style={{ color: "#B197FC", marginRight: "10px" }}
                ></i>
                Đơn mua
              </a>
            </li>

            <li>
              <a href="#">
                <i
                  className="fa-solid fa-ticket"
                  style={{ color: "#B197FC", marginRight: "10px" }}
                ></i>
                Kho Voucher
              </a>
            </li>
          </ul>
        </div>

        <div className="account-info">
          <div style={{ padding: "20px" }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              {/* Input tìm kiếm voucher */}
              <Input
                placeholder="Tìm kiếm voucher"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: "300px", marginBottom: "20px" }}
              />

              <Row gutter={[16, 16]}>
                {filteredVouchers.map((voucher) => (
                  <Col span={8} key={voucher.id}>
                    <Card
                      title={`Voucher ${voucher.code}`}
                      extra={
                        <Tag
                          color={
                            voucher.status === "active"
                              ? "green"
                              : voucher.status === "used"
                              ? "blue"
                              : "red"
                          }
                        >
                          {voucher.status}
                        </Tag>
                      }
                      actions={[
                        <Button
                          icon={<CopyOutlined />}
                          onClick={() => handleCopy(voucher.code)}
                        >
                          Sao chép mã
                        </Button>,
                      ]}
                      style={{ width: "100%" }}
                    >
                      <p>{voucher.description}</p>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Space>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Voucher;
