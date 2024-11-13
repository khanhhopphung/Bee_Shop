import { EditOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, CheckboxProps, Input, Space } from "antd";
import React from "react";

const Adrress = () => {
  const onChange: CheckboxProps["onChange"] = (e) => {
    console.log(`checked = ${e.target.checked}`);
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

        <div className="address-info">
          <div className="adrs-1" style={{ display: "flex" }}>
            <h2>Địa chỉ của tôi</h2>
            <Button
              icon={<PlusOutlined />}
              type="dashed"
              style={{
                width: "150px",
                marginLeft: "720px",
                backgroundColor: "#7280e0",
                color: "white",
              }}
            >
              Thêm địa chỉ mới
            </Button>
          </div>

          <div className="address-list">
            <div className="address-item">
              <div className="adrs-items" style={{ marginTop: "6px" }}>
                <p>
                  <b>Khánh Ly</b> | 0968249852
                </p>
                <p>số 100, ngõ 328, Thanh Xuân, Hà Nội</p>
              </div>
              <div className="address-actions">
                <div className="adrs-actions" style={{ display: "flex" }}>
                  <Button type="link">Cập nhật</Button>
                  <Button type="link" danger>
                    Xóa
                  </Button>
                </div>
                <Button style={{ marginBottom: "20px" }}>
                  Thiết lập mặc định
                </Button>
              </div>
            </div>
          </div>
          <div className="address-list">
            <div className="address-item">
              <div>
                <p>
                  <b>Khánh Hợp</b> | 0968249852
                </p>
                <p>số 19, Ngõ 99, Cầu Diễn, Bắc Từ Liêm, Hà Nội</p>
              </div>
              <div className="address-actions">
                <div className="adrs-actions" style={{ display: "flex" }}>
                  <Button type="link">Cập nhật</Button>
                  <Button type="link" danger>
                    Xóa
                  </Button>
                </div>
                <Button style={{ marginBottom: "20px" }}>
                  Thiết lập mặc định
                </Button>
              </div>
            </div>
          </div>
          <div className="address-list">
            <div className="address-item">
              <div>
                <p>
                  <b>Khánh Hợp</b> | 0968249852
                </p>
                <p>số 19, Ngõ 99, Cầu Diễn, Bắc Từ Liêm, Hà Nội</p>
              </div>
              <div className="address-actions">
                <div className="adrs-actions" style={{ display: "flex" }}>
                  <Button type="link">Cập nhật</Button>
                  <Button type="link" danger>
                    Xóa
                  </Button>
                </div>
                <Button style={{ marginBottom: "20px" }}>
                  Thiết lập mặc định
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Adrress;
