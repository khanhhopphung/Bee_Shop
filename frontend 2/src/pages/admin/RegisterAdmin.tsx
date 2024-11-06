import React from "react";

type Props = {};

const RegisterAdmin : React.FC = () => {
  return (
    <div>
      <body className="app app-signup p-0">
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
                <h2 className="auth-heading text-center mb-4">Đăng ký</h2>

                <div className="auth-form-container text-start mx-auto">
                  <form className="auth-form auth-signup-form">
                    <div className="email mb-3">
                      <label className="sr-only" htmlFor="signup-name">
                        Tên của bạn
                      </label>
                      <input
                        id="signup-name"
                        name="signup-name"
                        type="text"
                        className="form-control signup-name"
                        placeholder="Họ và tên"
                        required
                      />
                    </div>
                    <div className="email mb-3">
                      <label className="sr-only" htmlFor="signup-email">
                        Email
                      </label>
                      <input
                        id="signup-email"
                        name="signup-email"
                        type="email"
                        className="form-control signup-email"
                        placeholder="Email"
                        required
                      />
                    </div>
                    <div className="password mb-3">
                      <label className="sr-only" htmlFor="signup-password">
                        Mật khẩu
                      </label>
                      <input
                        id="signup-password"
                        name="signup-password"
                        type="password"
                        className="form-control signup-password"
                        placeholder="Mật khẩu"
                        required
                      />
                    </div>
                    <div className="extra mb-3">
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
                          Tôi đồng ý với{" "}
                          <a href="#" className="app-link">
                            Terms of Service
                          </a>{" "}
                          và{" "}
                          <a href="#" className="app-link">
                            Privacy Policy
                          </a>
                          .
                        </label>
                      </div>
                    </div>

                    <div className="text-center">
                      <button
                        type="submit"
                        className="btn app-btn-primary w-100 theme-btn mx-auto"
                      >
                        Sign Up
                      </button>
                    </div>
                  </form>

                  <div className="auth-option text-center pt-5">
                    Bạn đã có tài khoản ?{" "}
                    <a className="text-link" href="/login">
                      Đăng nhập
                    </a>
                  </div>
                </div>
              </div>

              <footer className="app-auth-footer"></footer>
            </div>
          </div>
        </div>
      </body>
    </div>
  );
};

export default RegisterAdmin;
