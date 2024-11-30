import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const ResetPass: React.FC = () => {
  const [email, setEmail] = useState(""); // Thay đổi từ username thành email
  const [password_hash, setPassword_hash] = useState(""); // Mật khẩu mới
  const [password_hash_confirmation, setPassword_hash_confirmation] =
    useState(""); // Nhập lại mật khẩu mới
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

    if (!email || !password_hash || !password_hash_confirmation) {
      message.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (password_hash !== password_hash_confirmation) {
      message.error("Mật khẩu và xác nhận mật khẩu không khớp.");
      return;
    }

    setLoading(true); // Bắt đầu loading

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password_hash: password_hash,
          password_hash_confirmation: password_hash_confirmation, // Đảm bảo trường này được gửi đi đúng tên
        }), // Gửi email và mật khẩu mới
      });

      setLoading(false); // Kết thúc loading

      if (!response.ok) {
        const errorData = await response.json();
        message.error(
          errorData.message || "Đã xảy ra lỗi khi thay đổi mật khẩu."
        );
        return;
      }

      const data = await response.json();
      message.success("Mật khẩu đã được thay đổi thành công.");

      // Điều hướng đến trang đăng nhập
      navigate("/login");
    } catch (error) {
      setLoading(false); // Kết thúc loading nếu có lỗi
      message.error("Có lỗi xảy ra. Vui lòng thử lại.");
      console.error("Error during password reset:", error);
    }
  };
  console.log(password_hash); // Kiểm tra giá trị của mật khẩu mới
  console.log(password_hash_confirmation); // Kiểm tra giá trị của xác nhận mật khẩu

  return (
    <Spin
      spinning={loading}
      indicator={
        <LoadingOutlined style={{ fontSize: 24, color: "green" }} spin />
      }
      tip={<span style={{ color: "green" }}>Đang thay đổi mật khẩu...</span>}
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
                  Đặt lại mật khẩu
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

                    <div className="password mb-3">
                      <input
                        type="password" // Input cho mật khẩu mới
                        className="form-control signup-name"
                        placeholder="Mật khẩu mới"
                        value={password_hash}
                        onChange={(e) => setPassword_hash(e.target.value)} // Cập nhật mật khẩu
                      />
                    </div>

                    <div className="confirm-password mb-3">
                      <input
                        type="password" // Input cho xác nhận mật khẩu
                        className="form-control signup-name"
                        placeholder="Nhập lại mật khẩu mới"
                        value={password_hash_confirmation}
                        onChange={(e) =>
                          setPassword_hash_confirmation(e.target.value)
                        } // Cập nhật xác nhận mật khẩu
                      />
                    </div>

                    <div className="text-center">
                      <button
                        type="submit"
                        className="btn app-btn-primary w-100 theme-btn mx-auto"
                      >
                        Thay đổi mật khẩu
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

export default ResetPass;
