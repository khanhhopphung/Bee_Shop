import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const VerifyOtp: React.FC = () => {
  const [email, setEmail] = useState(""); // Thay đổi từ username thành email
  const [token, setToken] = useState(""); // Thêm state để lưu mã OTP
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra nếu đã đăng nhập và có token
    const accessToken = localStorage.getItem("access_token");
    const roleId = localStorage.getItem("role_id");

    if (accessToken && roleId) {
      // Điều hướng dựa trên role_id
      if (roleId == "2") {
        navigate("/admin/statistics");
      } else {
        navigate("/"); // Điều hướng đến trang client
      }
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !token) {
      message.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    setLoading(true); // Bắt đầu loading

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token }), // Gửi email và token
      });

      setLoading(false); // Kết thúc loading

      if (!response.ok) {
        const errorData = await response.json();
        message.error(
          errorData.message || "Đã xảy ra lỗi khi xác minh mã OTP."
        );
        return;
      }

      const data = await response.json();
      message.success("Mã OTP xác minh thành công.");

      // Điều hướng đến trang đặt lại mật khẩu
      navigate("/reset-pass", { state: { email } });
    } catch (error) {
      setLoading(false); // Kết thúc loading nếu có lỗi
      message.error("Có lỗi xảy ra. Vui lòng thử lại.");
      console.error("Error during OTP verification:", error);
    }
  };

  return (
    <Spin
      spinning={loading}
      indicator={
        <LoadingOutlined style={{ fontSize: 24, color: "green" }} spin />
      }
      tip={<span style={{ color: "green" }}>Đang xác minh mã OTP...</span>}
    >
      <div className="app app-login p-0">
        <div className="row g-0 app-auth-wrapper">
          <div className="col-12 col-md-5 col-lg-6 h-100 auth-background-col">
            <div className="auth-background-holder"></div>
            <div className="auth-background-mask"></div>
          </div>
          <div className="col-12 col-md-7 col-lg-6 auth-main-col text-center p-5">
            <div className="d-flex flex-column align-content-end">
              <div className="app-auth-body mx-auto">
                <div className="app-auth-branding mb-4">
                  <p>BEE STORE</p>
                </div>
                <h2 className="auth-heading text-center mb-5">
                  Xác minh Email
                </h2>
                <div className="auth-form-container text-start">
                  <form
                    className="auth-form login-form"
                    onSubmit={handleSubmit}
                  >
                    <div className="email mb-3">
                      <input
                        type="email" // Input cho email
                        className="form-control signup-name"
                        placeholder="Email:"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="otp mb-3">
                      <input
                        type="text" // Input cho mã OTP
                        className="form-control signup-name"
                        placeholder="Mã OTP"
                        value={token}
                        onChange={(e) => setToken(e.target.value)} // Thay đổi state cho mã OTP
                      />
                    </div>

                    <div className="text-center">
                      <button
                        type="submit"
                        className="btn app-btn-primary w-100 theme-btn mx-auto"
                      >
                        Xác minh mã OTP
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <footer className="app-auth-footer">
                <div className="container text-center py-3"></div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default VerifyOtp;
