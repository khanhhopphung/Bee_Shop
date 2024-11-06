import React, { useState } from "react";
import Layout from "../../components/Layout";
import { Navigate, useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Something went wrong.");
        return;
      }

      const data = await response.json();
      // Lưu token hoặc thông tin người dùng
      console.log("Login successful:", data);
      // Chuyển hướng hoặc thực hiện hành động khác sau khi đăng nhập thành công
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user_name", data.user_name);
      console.log(localStorage.getItem("user_name"));

      navigate("/");
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="app app-login p-0">
      <Layout>
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
                        placeholder="Password"
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
      </Layout>
    </div>
  );
};

export default Login;
