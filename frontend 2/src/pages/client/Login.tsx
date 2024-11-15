import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { message, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

type LoginProps = {
  updateUserName: (name: string) => void;
};
const Login: React.FC<LoginProps> = ({ updateUserName }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false); // Thêm trạng thái loading
  const navigate = useNavigate();

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
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user_name", data.user_name);
      console.log(localStorage.getItem("user_name"));
      updateUserName(data.user_name);
      navigate("/");
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
        {/* <Layout q={10}> */}
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
                <h2 className="auth-heading text-center mb-5">Đăng nhập</h2>
                <div className="auth-form-container text-start">
                  <form
                    className="auth-form login-form"
                    onSubmit={handleSubmit}
                  >
                    <div className="username mb-3">
                      <label className="sr-only" htmlFor="signup-name">
                        Username
                      </label>
                      <input
                        id="signup-name"
                        name="signup-name"
                        type="text"
                        className="form-control signup-name"
                        placeholder="Họ và tên :"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
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
                      >
                        Đăng nhập
                      </button>
                    </div>
                  </form>
                  <div className="auth-option text-center pt-5">
                    Bạn chưa có tài khoản ? Đăng ký{" "}
                    <a className="text-link" href="/register">
                      ở đây
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
        {/* </Layout> */}
      </div>
    </Spin>
  );
};

export default Login;
