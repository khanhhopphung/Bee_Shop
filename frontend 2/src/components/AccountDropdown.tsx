import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

interface Props {
  userName: string | null;
  onLogout: () => void;
}

const AccountDropdown: React.FC<Props> = ({ userName, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="flex-c-m h-full p-l-10 p-r-10 bor5 relative">
      <div
        className={`icon-header-item ${
          userName ? "cl2" : "cl2 hov-cl1"
        } trans-04 p-lr-11`}
        onClick={toggleDropdown}
        style={{ cursor: "pointer" }}
      >
        {userName ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <FaUserCircle style={{ fontSize: "16px", marginRight: "5px" }} />
            <p style={{ fontSize: "12px", margin: 0 }}>{userName}</p>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center" }}>
            <FaUserCircle style={{ fontSize: "17px", marginRight: "5px" }} />
            <p style={{ fontSize: "12px", margin: 0 }}>Tài khoản</p>
          </div>
        )}
      </div>
      {isOpen && (
        <div
          id="account-dropdown"
          className="dropdown-menu relative"
          style={{
            position: "absolute",
            top: "100%", // Đặt dropdown ngay bên dưới
            left: "83%", // Căn chỉnh dropdown với icon
            backgroundColor: "white",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.15)",
            zIndex: 10,
            width: "150px",
            borderRadius: "0",
          }}
        >
          {userName ? (
            <>
              <Link
                to={`/account`}
                className=" cl4 hov-cl1 trans-04 js-name-b2 p-b-6"
              >
                <div
                  className="dropdown-item"
                  style={{
                    cursor: "pointer",
                    color: "#333",
                    padding: "5px 10px",
                    fontSize: "14px",
                    textAlign: "left",
                    transition: "background 0.3s",
                  }}
                >
                  Thông tin cá nhân
                </div>
              </Link>
              <div
                className="dropdown-item"
                style={{
                  cursor: "pointer",
                  color: "#333",
                  padding: "5px 10px",
                  fontSize: "14px",
                  textAlign: "left",
                  transition: "background 0.3s",
                }}
              >
                Lịch sử đơn hàng
              </div>
              <Link to={`/wishlist`}>
                <div
                  className="dropdown-item"
                  style={{
                    cursor: "pointer",
                    color: "#333",
                    padding: "5px 10px",
                    fontSize: "14px",
                    textAlign: "left",
                    transition: "background 0.3s",
                  }}
                >
                  Danh sách yêu thích
                </div>
              </Link>
              <div
                className="dropdown-item"
                onClick={onLogout}
                style={{
                  cursor: "pointer",
                  color: "#333",
                  padding: "5px 10px",
                  fontSize: "14px",
                  textAlign: "left",
                  transition: "background 0.3s",
                }}
              >
                Đăng xuất
              </div>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="dropdown-item"
                style={{
                  display: "block",
                  padding: "5px 10px",
                  textAlign: "center",
                  color: "#333",
                  fontSize: "14px",
                }}
              >
                Đăng ký
              </Link>
              <Link
                to="/login"
                className="dropdown-item"
                style={{
                  display: "block",
                  padding: "5px 10px",
                  textAlign: "center",
                  color: "#333",
                  fontSize: "14px",
                }}
              >
                Đăng nhập
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountDropdown;
