import { CopyOutlined, EditOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Col, Input, Row, Space, Tag } from "antd";
import React, { useEffect, useState } from "react";
interface Promotion {
  id: number;
  code: string; // Mã giảm giá
  discount_type: string;
  discount_value: string; // Giá trị giảm giá
  usage_limit: number; // Số lần sử dụng tối đa
  start_date: string; // Ngày bắt đầu
  end_date: string; // Ngày kết thúc
  min_purchase_amount: number | null; // Số tiền tối thiểu để áp dụng
}
const Voucher: React.FC = () => {
  const [vouchers, setVouchers] = useState<Promotion[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const vouchersPerPage = 6;
  const [searchTerm, setSearchTerm] = useState<string>("");
  const token = localStorage.getItem("access_token");

  // Call API để lấy danh sách voucher
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/get-list-voucher`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data.data)) {
          setVouchers(data.data);
        } else {
          console.error("Dữ liệu API không hợp lệ:", data);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };

    fetchVouchers();
  }, [token]); // Ensure token is checked on fetch

  const filteredVouchers = searchTerm
    ? vouchers.filter((voucher) =>
        voucher.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : vouchers;

  // Tính toán dữ liệu phân trang
  const indexOfLastVoucher = currentPage * vouchersPerPage;
  const indexOfFirstVoucher = indexOfLastVoucher - vouchersPerPage;
  const currentVouchers = filteredVouchers.slice(
    indexOfFirstVoucher,
    indexOfLastVoucher
  );
  const totalPages = Math.ceil(filteredVouchers.length / vouchersPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <div className="account-page">
      <div className="account-content">
        <div className="menu">
          <div style={{ display: "flex", alignItems: "center" }}>
            <i
              className="fa-solid fa-circle-user"
              style={{ marginLeft: "5px", fontSize: "40px" }}
            ></i>
            <div className="profile-details" style={{ marginLeft: "10px" }}>
              <h3>Username</h3>

              <p>
                {" "}
                <EditOutlined /> Sửa hồ sơ
              </p>
            </div>
          </div>

          <ul>
            <li>
              <a href="/account">
                <i
                  className="fa-solid fa-user"
                  style={{ color: "#B197FC", marginRight: "10px" }}
                ></i>
                Tài khoản của tôi
              </a>
              <ul style={{ marginLeft: "30px" }}>
                <li>
                  <a href="/account">Hồ sơ</a>
                </li>
                <li>
                  <a href="/update-password">Đổi Mật Khẩu</a>
                </li>
                <li>
                  <a href="/adrress">Địa Chỉ</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="#">
                <i
                  className="fa-solid fa-clipboard-list"
                  style={{ color: "#B197FC", marginRight: "10px" }}
                ></i>
                Đơn mua
              </a>
            </li>

            <li>
              <a href="#">
                <i
                  className="fa-solid fa-ticket"
                  style={{ color: "#B197FC", marginRight: "10px" }}
                ></i>
                Kho Voucher
              </a>
            </li>
          </ul>
        </div>

        <div className="account-info">
          <div className="container my-4">
            <h2 className="text-center mb-4">Kho Voucher</h2>

            {/* Thanh tìm kiếm */}
            <div className="mb-4">
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm mã voucher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Danh sách voucher */}
            <div className="row">
              {currentVouchers.map((voucher) => (
                <div className="col-md-4 mb-4" key={voucher.id}>
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title text-primary">
                        {voucher.code}
                      </h5>
                      <p className="card-text">
                        Giảm:{" "}
                        {voucher.discount_type === "percentage"
                          ? `${voucher.discount_value}%`
                          : `${voucher.discount_value}₫`}
                      </p>
                      <p className="card-text text-muted">
                        Điều kiện:{" "}
                        {voucher.min_purchase_amount
                          ? `${voucher.min_purchase_amount}₫`
                          : "Không yêu cầu"}
                      </p>
                      <p className="card-text text-danger">
                        HSD:{" "}
                        {new Date(voucher.end_date).toLocaleDateString("vi-VN")}
                      </p>
                      <button className="btn btn-primary w-100">Lưu</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Phân trang */}
            <div className="d-flex justify-content-center mt-4">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`btn mx-1 ${
                    currentPage === index + 1
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Voucher;
