import React, { useState } from "react";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";

type Props = {};

const EmailVerify = (props: Props) => {
  const [email, setEmail] = useState("");
  const [verification_code, setVerification_Code] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Bắt đầu gửi dữ liệu...");

    try {
      if (!email || !verification_code) {
        setError("Vui lòng điền đầy đủ thông tin.");
        return;
      }
      const response = await fetch(`http://127.0.0.1:8000/api/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, verification_code }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Phản hồi thành công từ server:", data);
        setSuccess(data.message);
        navigate("/login");
      } else {
        const errorData = await response.json();
        console.error("Lỗi từ server:", errorData);
        setError(errorData.message || "Xác thực thất bại, vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
      setError("Đã xảy ra lỗi khi kết nối với server.");
    }
  };
  return (
    <Layout>
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
    </Layout>
  );
};

export default EmailVerify;
