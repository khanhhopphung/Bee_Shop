import React, { useState } from "react";

interface ReviewComponentProps {
  productId: number;
  onReviewSubmit: (productId: number, reviewData: any) => void;
}

const ReviewComponent: React.FC<ReviewComponentProps> = ({
  productId,
  onReviewSubmit,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const token = localStorage.getItem("access_token"); // Lấy token từ localStorage

  const handleRatingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRating(parseInt(event.target.value, 10));
  };

  const handleReviewTextChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setReviewText(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/products/${productId}/add-review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
        body: JSON.stringify({
          rating,
          reviewText,
        }),
      });

      if (response.ok) {
        const reviewData = await response.json();
        onReviewSubmit(productId, reviewData);
        setReviewText("");
        setRating(0);
      } else {
        throw new Error("Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="review-form">
      <form onSubmit={handleSubmit} className="review-form__container">
        <div className="review-form__field">
          <label htmlFor="rating">Xếp hạng:</label>
          <select
            id="rating"
            value={rating}
            onChange={handleRatingChange}
            disabled={isSubmitting}
            className="review-form__select"
          >
            <option value={0} disabled>
              Chọn xếp hạng
            </option>
            {[1, 2, 3, 4, 5].map((star) => (
              <option key={star} value={star}>
                {star} sao
              </option>
            ))}
          </select>
        </div>
        <div className="review-form__field">
          <label htmlFor="reviewText">Đánh giá:</label>
          <textarea
            id="reviewText"
            value={reviewText}
            onChange={handleReviewTextChange}
            disabled={isSubmitting}
            placeholder="Viết đánh giá..."
            className="review-form__textarea"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="review-form__button"
        >
          Gửi đánh giá
        </button>
      </form>
    </div>
  );
};

export default ReviewComponent;
