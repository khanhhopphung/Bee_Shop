// src/components/Login.tsx
import React from "react";
import Layout from "../../components/Layout";
import "../../css/portal.css";

import Footer from "../../components/Footer";
import Header from "../../components/Header";

const LoginAdmin: React.FC = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Xử lý logic đăng nhập ở đây
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
              <h2 className="auth-heading text-center mb-5">Đăng nhập</h2>
              <div className="auth-form-container text-start">
                <form className="auth-form login-form" onSubmit={handleSubmit}>
                  <div className="email mb-3">
                    <label className="sr-only" htmlFor="signin-email">
                      Email
                    </label>
                    <input
                      id="signin-email"
                      name="signin-email"
                      type="email"
                      className="form-control signin-email"
                      placeholder="Email address"
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
    </div>
  );
};

export default LoginAdmin;
