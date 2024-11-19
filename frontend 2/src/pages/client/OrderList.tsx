import { EditOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { Modal, Button, Rate, Input, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const OrderList = () => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [review, setReview] = useState({
    rating: 0,
    comment: "",
    images: [] as string[], // Lưu ảnh đã chọn
  });

  const handleReviewSubmit = () => {
    console.log("Đánh giá đã được gửi:", review);
    setShowReviewForm(false); // Đóng modal sau khi gửi đánh giá
    message.success("Đánh giá của bạn đã được gửi!");
  };

  const handleImageUpload = (file: any) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Chỉ cho phép tải lên file hình ảnh JPEG hoặc PNG!");
    }
    return isJpgOrPng;
  };

  const handleImageChange = (info: any) => {
    if (info.file.status === "done") {
      setReview({
        ...review,
        images: [...review.images, info.file.response.url], // Giả sử bạn nhận được URL của ảnh từ backend
      });
    }
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
              <a href="/order-list">
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
          <div className="order-info">
            <div className="order-tabs">
              <button className="order-tab active">Tất cả</button>
              <button className="order-tab">Chờ thanh toán</button>
              <button className="order-tab">Vận chuyển</button>
              <button className="order-tab">Chờ giao hàng</button>
              <button className="order-tab">Hoàn thành</button>
              <button className="order-tab">Đã hủy</button>
              <button className="order-tab">Trả hàng/Hoàn tiền</button>
            </div>

            <div className="order-item">
              <div className="order-product">
                <img
                  src="link_image_a.jpg"
                  alt="Sản phẩm A"
                  className="order-product-image"
                />
                <div className="order-product-info">
                  <p className="order-product-name">
                    Manga Lông Mi Mềm Mại Tự Nhiên Lông Mi Dày Lông Mi Giả
                  </p>
                  <p className="order-product-variant">Phân loại: Keo dán</p>
                  <p className="order-product-quantity">x1</p>
                </div>
                <p className="order-product-price">₫15.000</p>
              </div>

              <div className="order-item-footer">
                <span className="order-total-label">Thành tiền:</span>
                <span className="order-total-price">₫47.000</span>
              </div>

              <div className="order-item-actions">
                <button
                  className="order-btn order-btn-reorder"
                  onClick={() => setShowReviewForm(true)}
                >
                  Đánh giá
                </button>
                <button className="order-btn order-btn-detail">
                  Xem Chi Tiết Hủy Đơn
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal đánh giá */}
        <Modal
          title="Đánh giá sản phẩm"
          visible={showReviewForm}
          onCancel={() => setShowReviewForm(false)}
          footer={[
            <Button key="cancel" onClick={() => setShowReviewForm(false)}>
              Hủy
            </Button>,
            <Button key="submit" type="primary" onClick={handleReviewSubmit}>
              Gửi Đánh Giá
            </Button>,
          ]}
        >
          <div>
            <label>Chấm điểm:</label>
            <Rate
              value={review.rating}
              onChange={(value) => setReview({ ...review, rating: value })}
            />
          </div>
          <div style={{ marginTop: 20 }}>
            <label>Nhận xét:</label>
            <Input.TextArea
              rows={4}
              value={review.comment}
              onChange={(e) =>
                setReview({ ...review, comment: e.target.value })
              }
              placeholder="Nhập nhận xét của bạn..."
            />
          </div>
          <div style={{ marginTop: 20 }}>
            <label>Thêm ảnh:</label>
            <Upload
              action="/upload" // Địa chỉ API để upload ảnh
              listType="picture-card"
              //   fileList={review.images.map((url) => ({ url }))}
              onChange={handleImageChange}
              beforeUpload={handleImageUpload}
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Tải lên</div>
              </div>
            </Upload>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default OrderList;
