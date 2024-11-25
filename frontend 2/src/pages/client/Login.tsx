import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

type LoginProps = {
  updateUserName: (name: string) => void;
};

const Login: React.FC<LoginProps> = ({ updateUserName }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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

    if (!username || !password) {
      message.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    setLoading(true); // Bắt đầu loading

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      setLoading(false); // Kết thúc loading

      if (!response.ok) {
        const errorData = await response.json();
        message.error(
          errorData.message || "Thông tin đăng nhập không chính xác."
        );
        return;
      }

      const data = await response.json();
      message.success("Đăng nhập thành công!");

      // Lưu thông tin vào localStorage
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user_name", data.user_name);
      localStorage.setItem("role_id", data.role_id); // Lưu role_id


      // console.log(localStorage.getItem("user_name"));
      updateUserName(data.user_name);

      // Điều hướng dựa trên role_id
      if (data.role_id == "2") {
        navigate("/admin/statistics"); // Đến trang admin
      } else  {
        navigate("/"); // Đến trang client
      }
    } catch (error) {
      setLoading(false); // Kết thúc loading nếu có lỗi
      message.error("Có lỗi xảy ra. Vui lòng thử lại.");
      console.error("Error during login:", error);
    }
  };

  return (
    <Spin
      spinning={loading}
      indicator={
        <LoadingOutlined style={{ fontSize: 24, color: "green" }} spin />
      }
      tip={<span style={{ color: "green" }}>Đang đăng nhập...</span>}
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
                <h2 className="auth-heading text-center mb-5">Đăng nhập</h2>
                <div className="auth-form-container text-start">
                  <form className="auth-form login-form" onSubmit={handleSubmit}>
                    <div className="username mb-3">
                      <input
                        type="text"
                        className="form-control signup-name"
                        placeholder="Họ và tên :"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    <div className="password mb-3">
                      <input
                        type="password"
                        className="form-control signin-password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                      />
                    </div>
                    <div className="text-center">
                      <button
                        type="submit"
                        className="btn app-btn-primary w-100 theme-btn mx-auto"
                      >
                        Đăng nhập
                      </button>
                    </div>
                  </form>
                  <div className="auth-option text-center pt-5">
                    Bạn chưa có tài khoản?{" "}
                    <a className="text-link" href="/register">
                      Đăng ký ở đây
                    </a>
                    .
                  </div>
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

export default Login;
