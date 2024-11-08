import React, { useState } from "react";
import { message, Spin } from "antd";
import { useNavigate } from "react-router-dom";

type Props = {};

const EmailVerify = (props: Props) => {
  const [email, setEmail] = useState("");
  const [verification_code, setVerification_Code] = useState("");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !verification_code) {
      message.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, verification_code }),
      });

      if (response.ok) {
        const data = await response.json();
        message.success("Xác thực thành công!");
        navigate("/login");
      } else {
        const errorData = await response.json();
        message.error(
          errorData.message || "Xác thực thất bại, vui lòng thử lại."
        );
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
      message.error("Đã xảy ra lỗi khi kết nối với server.");
    }
  };
  return (
    <Spin spinning={loading} tip="Đang đăng ký...">
      <div className="app app-signup p-0">
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
                <h2 className="auth-heading text-center mb-4">
                  Xác thực email
                </h2>

                <div className="auth-form-container text-start mx-auto">
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="email-verify mb-3">
                    <label className="sr-only" htmlFor="signup-email-verify">
                      Mã xác thực
                    </label>
                    <input
                      id="signup-email-verify"
                      name="signup-email-verify"
                      type="text"
                      className="form-control signup-email-verify"
                      placeholder="Mã xác thực"
                      value={verification_code}
                      onChange={(e) => setVerification_Code(e.target.value)}
                      required
                    />
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn app-btn-primary w-100 theme-btn mx-auto"
                      onClick={(e) => handleVerification(e)}
                    >
                      Gửi
                    </button>
                  </div>
                  {/* </form> */}

                  <div className="auth-option text-center pt-5">
                    Bạn đã có tài khoản?{" "}
                    <a className="text-link" href="/login">
                      Đăng nhập
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <footer className="app-auth-footer"></footer>
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default EmailVerify;
