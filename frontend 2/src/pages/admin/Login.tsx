import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import "../../css/portal.css";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { message } from "antd"; // Để thông báo lỗi hoặc thành công

const LoginAdmin: React.FC = () => {
  // Khai báo state cho email, password và loading
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Xử lý sự kiện submit form
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username || !password) {
      message.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    setLoading(true); // Bắt đầu loading

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      setLoading(false); // Kết thúc loading

      if (!response.ok) {
        const errorData = await response.json();
        message.error(errorData.message || "Thông tin đăng nhập không chính xác.");
        return;
      }

      const data = await response.json();
      message.success("Đăng nhập thành công!");

      // Lưu thông tin vào localStorage
      localStorage.setItem("user_name", data.user_name);
      localStorage.setItem("role_id", data.role_id);

      // Điều hướng đến trang admin nếu role_id = 2
      if (data.role_id === "2") {
        navigate("/admin/statistics"); // Đến trang admin
      } else {
        navigate("/admin/statistics"); // Đến trang client
      }
    } catch (error) {
      setLoading(false); // Kết thúc loading nếu có lỗi
      message.error("Có lỗi xảy ra. Vui lòng thử lại.");
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="app app-login p-0">
      <div className="row g-0 app-auth-wrapper">
        <div className="col-12 col-md-5 col-lg-6 h-100 auth-background-col">
          <div className="auth-background-holder"></div>
          <div className="auth-background-mask"></div>
          <div className="auth-background-overlay p-3 p-lg-5">
            <div className="d-flex flex-column align-content-end h-100">
              <div className="h-100"></div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-7 col-lg-6 auth-main-col text-center p-5">
          <div className="d-flex flex-column align-content-end">
            <div className="app-auth-body mx-auto">
              <div className="app-auth-branding mb-4">
                <a className="app-logo" href="/">
                  <p>BEE STORE</p>
                </a>
              </div>
              <h2 className="auth-heading text-center mb-5">Đăng nhập Admin</h2>
              <div className="auth-form-container text-start">
                <form className="auth-form login-form" onSubmit={handleSubmit}>
                  <div className="email mb-3">
                    <label className="sr-only" htmlFor="signin-email">
                      Email
                    </label>
                    <input
                      id="signin-email"
                      name="signin-email"
                      type="text" // Thay đổi thành 'text' vì bạn muốn nhập tên đăng nhập
                      className="form-control signin-email"
                      placeholder="user admin"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="password mb-3">
                    <label className="sr-only" htmlFor="signin-password">
                      Mật khẩu
                    </label>
                    <input
                      id="signin-password"
                      name="signin-password"
                      type="password"
                      className="form-control signin-password"
                      placeholder="Password admin"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <div className="extra mt-3 row justify-content-between">
                      <div className="col-6">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="RememberPassword"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="RememberPassword"
                          >
                            Nhớ mật khẩu
                          </label>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="forgot-password text-end">
                          <a href="reset-password.html">Quên mật khẩu?</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn app-btn-primary w-100 theme-btn mx-auto"
                      disabled={loading} // Disable nút khi đang loading
                    >
                      {loading ? "Đang đăng nhập..." : "Đăng nhập"}
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
  );
};

export default LoginAdmin;
