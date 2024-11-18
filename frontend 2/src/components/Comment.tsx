import React from "react";

const Comment: React.FC = () => {
  return (
    <div className="review-order">
      <h2>Đánh giá sản phẩm</h2>
      <div className="product-review">
        <img
          src="link_image_a.jpg"
          alt="Sản phẩm A"
          className="product-image"
        />
        <div className="product-info">
          <h3>Sản phẩm A</h3>
          <div className="rating">
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
          </div>
          <textarea placeholder="Nhập đánh giá của bạn..." />
        </div>
      </div>
      <div className="product-review">
        <img
          src="link_image_b.jpg"
          alt="Sản phẩm B"
          className="product-image"
        />
        <div className="product-info">
          <h3>Sản phẩm B</h3>
          <div className="rating">
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
          </div>
          <textarea placeholder="Nhập đánh giá của bạn..." />
        </div>
      </div>
      <button className="submit-review">Gửi đánh giá</button>
    </div>
  );
};

export default Comment;
