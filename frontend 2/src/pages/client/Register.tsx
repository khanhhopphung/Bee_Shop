import React, { useState } from "react";
import { Spin, message } from "antd";
import { useNavigate } from "react-router-dom";
interface RegisterResponse {
  status: string;
  message: string;
  errors?: {
    [field: string]: string[]; // Mỗi trường sẽ có một mảng các thông báo lỗi
  };
}

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password_hash, setPassword_hash] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // State để kiểm soát trạng thái loading

  const navigate = useNavigate();

  const clickLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !password_hash || !phone) {
      message.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    setLoading(true); // Bắt đầu loading
    setError(null); // Xóa lỗi nếu có

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password_hash, phone }),
      });

      const data: RegisterResponse = await response.json(); // Đọc dữ liệu chỉ một lần

      if (response.ok) {
        message.success(
          "Đăng ký thành công! Vui lòng kiểm tra email để lấy mã xác nhận."
        ); // Hiển thị thông báo thành công
        navigate("/verify");
      } else {
        // Hiển thị thông báo lỗi nếu có
        if (data.status === "error" && data.errors) {
          const errorMessages = Object.entries(data.errors)
            .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
            .join("\n");
          message.error(`Lỗi đăng ký:\n${errorMessages}`);
        } else {
          setError(data.message || "Đăng ký thất bại, vui lòng thử lại.");
        }
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
      setError("Đã xảy ra lỗi khi kết nối với server.");
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  return (
    // <Layout q={10}>
    <div className="app app-signup p-0">
      <Spin spinning={loading} tip="Đang đăng ký...">
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
                  {/* <form
                    className="auth-form auth-signup-form"
                    // onSubmit={handleSubmit}
                  > */}
                  <div className="username mb-3">
                    <label className="sr-only" htmlFor="signup-name">
                      Tên của bạn
                    </label>
                    <input
                      id="signup-name"
                      name="signup-name"
                      type="text"
                      className="form-control signup-name"
                      placeholder="Username :"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      value={password_hash}
                      onChange={(e) => setPassword_hash(e.target.value)}
                      required
                    />
                  </div>

                  <div className="confirm-password mb-3">
                    <label
                      className="sr-only"
                      htmlFor="signup-confirm-password"
                    >
                      Số điện thoại
                    </label>
                    <input
                      id="signup-phone"
                      name="signup-phone"
                      type="text"
                      className="form-control signup-phone"
                      placeholder="Số điện thoại"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
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
                  {error && (
                    <div className="error text-center text-danger">{error}</div>
                  )}

                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn app-btn-primary w-100 theme-btn mx-auto"
                      onClick={(e) => clickLogin(e)}
                    >
                      Đăng ký
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

              <footer className="app-auth-footer"></footer>
            </div>
          </div>
        </div>
      </Spin>
    </div>
    // </Layout>
  );
};

export default Register;
