import { EditOutlined } from "@ant-design/icons";
import { Button, Input, Form, message } from "antd";
import React, { useEffect, useState } from "react";
interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
}
const UpdatePass = () => {
  const [step, setStep] = useState(1); // Quản lý bước hiện tại (1: nhập email, 2: nhập OTP, 3: nhập mật khẩu mới)
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password_hash, setPassword_hash] = useState("");
  const [password_hash_confirmation, setPassword_hash_confirmation] =
    useState("");
  const token = localStorage.getItem("access_token");
  const [loading, setLoading] = useState(false); // Trạng thái loading

  const handleEmailSubmit = async (values: any) => {
    const { email } = values;
    // Gửi yêu cầu OTP đến email
    setLoading(true); // Bắt đầu loading
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setEmail(email);
        setStep(2); // Chuyển sang bước nhập mã OTP
        message.success("Mã OTP đã được gửi đến email của bạn.");
      } else {
        message.error(data.message || "Không thể gửi mã OTP.");
      }
    } catch (error) {
      message.error("Lỗi khi gửi mã OTP.");
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  const handleOtpSubmit = async (values: any) => {
    const { otp } = values; // Giả sử bạn gọi OTP là otp
    // Gửi yêu cầu xác nhận OTP
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token: otp }), // Đảm bảo gửi đúng tên trường 'token'
      });

      const data = await response.json();
      if (response.ok) {
        setStep(3); // Chuyển sang bước nhập mật khẩu mới
        message.success("Mã OTP xác nhận thành công.");
      } else {
        message.error(data.message || "Mã OTP không đúng.");
      }
    } catch (error) {
      message.error("Lỗi khi xác nhận mã OTP.");
    }
  };

  const handlePasswordChange = async (values: any) => {
    const { password_hash, password_hash_confirmation } = values;

    // Kiểm tra mật khẩu mới và mật khẩu xác nhận
    if (password_hash !== password_hash_confirmation) {
      message.error("Mật khẩu mới và mật khẩu xác nhận không khớp!");
      return;
    }

    // Log dữ liệu để kiểm tra
    console.log("Password:", password_hash);
    console.log("Password Confirmation:", password_hash_confirmation);

    // Gửi yêu cầu đổi mật khẩu
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password_hash, // Đảm bảo truyền đúng trường `password_hash`
          password_hash_confirmation, // Đảm bảo truyền đúng trường `password_hash_confirmation`
        }),
      });

      const data = await response.json();
      console.log(data); // Log response để kiểm tra chi tiết

      if (response.ok) {
        setStep(4); // Chuyển sang bước 4: Thông báo thành công
        message.success("Đổi mật khẩu thành công!");
      } else {
        message.error(data.message || "Đã xảy ra lỗi khi đổi mật khẩu!");
      }
    } catch (error) {
      message.error("Lỗi khi đổi mật khẩu!");
    }
  };
  const [user, setUser] = useState<User>();
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
        console.log(data.data);
        setUser(data.data);
      } catch (e) {
        console.error("L��i khi lấy thông tin người dùng", e);
      }
    };
    fetchUser();
  }, []);
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
              <a href="/order-list">
                <i
                  className="fa-solid fa-clipboard-list"
                  style={{ color: "#B197FC", marginRight: "10px" }}
                ></i>
                Đơn mua
              </a>
            </li>

            <li>
              <a href="voucher">
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
          <h2>Đổi mật khẩu</h2>
          {/* Bước 1: Nhập email */}
          {step === 1 && (
            <Form name="email" onFinish={handleEmailSubmit} layout="vertical">
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Vui lòng nhập email của bạn!" },
                ]}
              >
                <Input placeholder="Nhập email của bạn" />
              </Form.Item>

              <Form.Item>
                {/* <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                  }}
                > */}
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  disabled={loading} // Disable nút khi đang loading
                >
                  {loading ? "Đang gửi OTP..." : "Gửi mã OTP"}{" "}
                  {/* Thay đổi text nút */}
                </Button>
                {/* </div> */}
              </Form.Item>
            </Form>
          )}

          {/* Bước 2: Nhập mã OTP */}
          {step === 2 && (
            <Form name="otp" onFinish={handleOtpSubmit} layout="vertical">
              {/* Không cần nhập lại email vì đã có sẵn trong state */}
              <Form.Item
                name="otp"
                label="Mã OTP"
                rules={[{ required: true, message: "Vui lòng nhập mã OTP!" }]}
              >
                <Input placeholder="Nhập mã OTP đã gửi đến email của bạn" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Xác nhận mã OTP
                </Button>
              </Form.Item>
            </Form>
          )}

          {/* Bước 3: Nhập mật khẩu mới */}
          {step === 3 && (
            <Form
              name="change-password"
              onFinish={handlePasswordChange}
              layout="vertical"
            >
              <Form.Item
                name="password_hash"
                label="Mật khẩu mới"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                ]}
              >
                <Input.Password placeholder="Nhập mật khẩu mới" />
              </Form.Item>

              <Form.Item
                name="password_hash_confirmation"
                label="Xác nhận mật khẩu"
                rules={[
                  { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                ]}
              >
                <Input.Password placeholder="Nhập lại mật khẩu mới" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Đổi mật khẩu
                </Button>
              </Form.Item>
            </Form>
          )}

          {/* Bước 4: Thông báo thành công */}
          {step === 4 && (
            <div>
              <h3>Đổi mật khẩu thành công!</h3>
              {/* <Button type="primary" onClick={() => setStep(1)} block>
                Quay lại trang đăng nhập
              </Button> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdatePass;
