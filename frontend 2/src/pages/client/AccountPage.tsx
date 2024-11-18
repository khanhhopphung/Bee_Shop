import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, CheckboxProps, Input, Space } from "antd";
import React from "react";

const AccountPage = () => {
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

        <div className="account-info">
          <h2
            style={{
              marginRight: "90%",
              width: "270px",
              fontSize: "2rem",
            }}
          >
            Thông tin tài khoản
          </h2>

          <div className="info-section">
            <h3 style={{ width: "150px" }}>Tên đăng nhập</h3>
            <p>hophin24</p>
          </div>

          <div className="info-section">
            <h3>Tên</h3>
            <Space.Compact>
              <Input defaultValue="Khánh Hợp" style={{ marginLeft: "28px" }} />
            </Space.Compact>
          </div>

          <div className="info-section">
            <h3>Email</h3>
            <p>kh*********@gmail.com</p>
            <button className="edit-button">Thay đổi</button>
          </div>

          <div className="info-section">
            <h3>Số điện thoại</h3>
            <p>*********52</p>
            <button className="edit-button">Thay đổi</button>
          </div>

          <div className="info-section">
            <h3>Giới tính</h3>
            <div style={{ marginLeft: "30px" }}>
              <Checkbox onChange={onChange}>Nam</Checkbox>
              <Checkbox onChange={onChange}>Nữ</Checkbox>
              <Checkbox onChange={onChange}>Khác</Checkbox>
            </div>
          </div>

          <div className="info-section">
            <h3>Ngày sinh</h3>
            <p>**/09/20**</p>
            <button className="edit-button">Thay đổi</button>
          </div>
          <Button type="primary" style={{ backgroundColor: "#717fe0" }}>
            Lưu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
