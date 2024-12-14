import React, { useState } from "react";
import axios from "axios";

const VNPayPayment = () => {
  const [amount, setAmount] = useState(900000000);
  const [paymentStatus, setPaymentStatus] = useState(""); // Trạng thái thanh toán

  const handlePayment = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/vnpay/create-payment",
        {
          amount: amount, // Số tiền
          description: "Thanh toán đơn hàng", // Thông tin mô tả đơn hàng
        }
      );

      const data = response.data;
      console.log(data);

      if (data.data) {
        // Chuyển hướng đến URL thanh toán VNPay
        window.location.href = data.data;
      }
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  const handlePaymentStatus = async () => {
    try {
      // Giả sử bạn nhận trạng thái thanh toán từ callback (VNPay trả về thông qua vnp_ReturnUrl)
      const urlParams = new URLSearchParams(window.location.search);
      const vnp_ResponseCode = urlParams.get("vnp_ResponseCode"); // Mã phản hồi giao dịch

      if (vnp_ResponseCode === "00") {
        setPaymentStatus("Thanh toán thành công");
        // Bạn có thể tạo đơn hàng hoặc xử lý logic khác ở đây
      } else {
        setPaymentStatus(`Thanh toán thất bại, mã lỗi: ${vnp_ResponseCode}`);
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      setPaymentStatus("Có lỗi trong quá trình kiểm tra thanh toán");
    }
  };

  // Gọi hàm handlePaymentStatus khi trang được tải lại (URL callback)
  React.useEffect(() => {
    if (window.location.search) {
      handlePaymentStatus(); // Kiểm tra trạng thái thanh toán
    }
  }, []);

  // const initiatePayment = async () => {
  //     const response = await fetch('http://127.0.0.1:8000/api/initiate-payment', {
  //       method: 'POST',
  //       body: JSON.stringify({ amount }),
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     const data = await response.json();
  //     if (data.payment_url) {
  //       window.location.href = data.payment_url; // Điều hướng đến trang thanh toán Momo
  //     }
  //   };

  return (
    <div>
      <h1>Thanh toán với VNPay</h1>
      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Nhập số tiền"
      />
      <button onClick={handlePayment}>Thanh toán</button>
      {/* <button onClick={initiatePayment}>Thanh toán</button> */}

      {/* Hiển thị kết quả thanh toán */}
      {paymentStatus && <p>{paymentStatus}</p>}
    </div>
  );
};

export default VNPayPayment;
