import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const ResetPassEmail: React.FC = () => {
  const [email, setEmail] = useState(""); // Thay đổi từ username thành email
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

    if (!email) {
      message.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    setLoading(true); // Bắt đầu loading

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/send-otp`, {
        // Sửa lại endpoint thành send-otp
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }), // Gửi email thay vì username và password
      });

      setLoading(false); // Kết thúc loading

      if (!response.ok) {
        const errorData = await response.json();
        message.error(errorData.message || "Đã xảy ra lỗi khi gửi mã OTP.");
        return;
      }

      const data = await response.json();
      message.success("Mã OTP đã được gửi đến email của bạn.");

      // Điều hướng đến trang xác nhận mã OTP
      navigate("/verify-otp", { state: { email } });
    } catch (error) {
      setLoading(false); // Kết thúc loading nếu có lỗi
      message.error("Có lỗi xảy ra. Vui lòng thử lại.");
      console.error("Error during sending OTP:", error);
    }
  };

  return (
    <Spin
      spinning={loading}
      indicator={
        <LoadingOutlined style={{ fontSize: 24, color: "green" }} spin />
      }
      tip={<span style={{ color: "green" }}>Đang gửi mã OTP...</span>}
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
                <h2 className="auth-heading text-center mb-5">Quên mật khẩu</h2>
                <div className="auth-form-container text-start">
                  <form
                    className="auth-form login-form"
                    onSubmit={handleSubmit}
                  >
                    <div className="email mb-3">
                      <input
                        type="email" // Sửa lại thành input email
                        className="form-control signup-name"
                        placeholder="Email:"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="text-center">
                      <button
                        type="submit"
                        className="btn app-btn-primary w-100 theme-btn mx-auto"
                      >
                        Gửi mã OTP
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

export default ResetPassEmail;
