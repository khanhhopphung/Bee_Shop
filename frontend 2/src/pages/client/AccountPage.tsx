import { EditOutlined } from "@ant-design/icons";
import { Button, Input, Modal, message, notification } from "antd";
import React, { useEffect, useState } from "react";

interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
}

const AccountPage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false); // State để hiển thị modal
  const [newPhone, setNewPhone] = useState<string>(""); // State để lưu số điện thoại mới
  const [user, setUser] = useState<User>(); // State thông tin người dùng
  const [isLoading, setIsLoading] = useState(false); // State cho loading
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/show-user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Lỗi khi lấy thông tin người dùng");
        }
        const data = await response.json();
        setUser(data.data);
      } catch (e) {
        console.error("Lỗi khi lấy thông tin người dùng", e);
      }
    };
    fetchUser();
  }, [token]);

  // Hiển thị modal
  const showModal = () => {
    setIsModalVisible(true);
    setNewPhone(user?.phone || ""); // Hiển thị số điện thoại hiện tại
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Xử lý khi lưu số điện thoại mới
  const handleSave = async () => {
    setIsLoading(true); // Hiển thị loading
    message.loading({
      content: "Đang cập nhật số điện thoại...",
      key: "updatePhone",
    });

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/update-phone/${user?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ phone: newPhone }),
        }
      );

      if (!response.ok) {
        throw new Error("Cập nhật số điện thoại thất bại");
      }

      const updatedUser = await response.json();
      setUser(updatedUser); // Cập nhật thông tin người dùng
      setIsModalVisible(false); // Đóng modal
      message.success({
        content: "Cập nhật số điện thoại thành công!",
        key: "updatePhone",
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật số điện thoại:", error);
      notification.error({
        message: "Lỗi",
        description: "Cập nhật số điện thoại thất bại. Vui lòng thử lại!",
      });
    } finally {
      setIsLoading(false); // Ẩn loading
    }
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
              <h3>{user?.username}</h3>
              <p>
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
              <a href="/order-list">
                <i
                  className="fa-solid fa-clipboard-list"
                  style={{ color: "#B197FC", marginRight: "10px" }}
                ></i>
                Đơn mua
              </a>
            </li>
            <li>
              <a href="/voucher">
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
          <h2 style={{ marginRight: "90%", width: "270px", fontSize: "2rem" }}>
            Thông tin tài khoản
          </h2>

          <div>
            <div className="info-section">
              <h3 style={{ width: "150px" }}>Tên đăng nhập</h3>
              <p>{user?.username}</p>
            </div>
            <div className="info-section">
              <h3>Email</h3>
              <p>{user?.email}</p>
              <button className="edit-button">Thay đổi</button>
            </div>
            <div className="info-section">
              <h3>Số điện thoại</h3>
              <p>{user?.phone}</p>
              <button
                className="edit-button"
                onClick={showModal}
                disabled={isLoading}
              >
                Thay đổi
              </button>
            </div>
            <Button type="primary" style={{ backgroundColor: "#717fe0" }}>
              Lưu
            </Button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        title="Chỉnh sửa số điện thoại mới"
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSave}
        confirmLoading={isLoading}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Input
          placeholder="Nhập số điện thoại mới"
          value={newPhone}
          onChange={(e) => setNewPhone(e.target.value)}
          disabled={isLoading} // Disable input khi đang loading
        />
      </Modal>
    </div>
  );
};

export default AccountPage;
