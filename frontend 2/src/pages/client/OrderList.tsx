import { EditOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Modal, Button, Rate, Input, Upload, message, Radio } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import Pusher from "pusher-js";
interface CartItem {
  product_id: any;
  color_id: any;
  size_id: any;
  quantity: any;
  price: number | null;
}
interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
}
interface Order {
  id: number;
  order_date: string;
  total_amount: number;
  status: string;
  payment_method: string;
  shipping_cost: string;
  order_code: string;
  name: string;
  phone: string;
  address: string;
  is_active: number;
  reviews: Reviewh[];
  order_details: {
    order_id: number;
    quantity: number;
    price: number;
    name: string;
    color_name: string;
    size_name: string;
    price_variant: string;
    product: Product;
    product_variant: ProductVariant;
    images: Image[];
    color: Color;
    size: Size;
  }[];
}
interface Reviewh {
  id: number;
  comment: string;
  rating: number;
  image: string | null;
  product_id: number;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  category_id: string;
}

interface ProductVariant {
  price: number;
  size: Size; // Thêm vào
  color: Color;
  images: Image[];
}

interface Image {
  id: number;
  image_url: any;
  alt_text: string;
}

interface Color {
  id: number;
  color_name: string;
}

interface Size {
  id: number;
  size_name: string;
}

interface Review {
  comment: string;
  rating: number;
  image: string | null;
  product_id: number;
}
const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [showRefundForm, setShowRefundForm] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [cancelOrder, setCanceldOrder] = useState<number>();
  const [refundOrder, setRefunddOrder] = useState<number>();
  const token = localStorage.getItem("access_token");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();
  const { confirm } = Modal;
  const [review, setReview] = useState<Review>({
    product_id: 0,
    rating: 0,
    comment: "",
    image: "", // Lưu ảnh đã chọn
  });
  const [productId, setProductId] = useState<number>();
  const [orderId, setOderId] = useState<number>();
  const cancelReasons = [
    "Tôi muốn cập nhật địa chỉ/số điện thoại nhận hàng.",
    "Tôi muốn thêm/thay đổi mã giảm giá.",
    "Tôi muốn thay đổi sản phẩm (kích thước, màu sắc, số lượng…).",
    "Thủ tục thanh toán rắc rối.",
    "Tôi tìm thấy chỗ mua khác tốt hơn (Rẻ hơn, uy tín hơn, giao nhanh hơn…).",
    "Tôi không có nhu cầu mua nữa.",
    "Tôi không tìm thấy lý do hủy phù hợp.",
  ];

  const refundReasons = [
    "Tôi muốn thay đổi sản phẩm (kích thước, màu sắc, số lượng…).",
    "Tôi tìm thấy chỗ mua khác tốt hơn (Rẻ hơn, uy tín hơn, giao nhanh hơn…).",
    "Tôi không tìm thấy lý do trả phù hợp.",
  ];
  const [loading, setLoading] = useState<string>("");
  useEffect(() => {
    console.log("Bắt đầu ... load");
    Pusher.logToConsole = true;

    const pusher = new Pusher("07bc45f6a417f8745a02", {
      cluster: "ap1",
    });

    const channel = pusher.subscribe("new");
    channel.bind("load", (data: any) => {
      console.log(data.code);
      setLoading(data.code);
    });

    return () => {
      pusher.unsubscribe("product");
    };
  }, []);

  const showConfirm = (orderId: number) => {
    confirm({
      title: "Bạn có chắc chắn đã nhận được hàng?",
      content: "Sau khi xác nhận, bạn sẽ không trả hàng được nữa !",
      okText: "Đúng, tôi đã nhận",
      cancelText: "Hủy",
      onOk() {
        handleConfirmOrder(orderId); // Gọi hàm xác nhận
      },
      onCancel() {
        message.info("Hủy xác nhận nhận hàng.");
      },
    });
  };

  const fectOrders = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/get-all-order-by-user`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOrders(data.data);
        console.log(data.data);
      } else {
        message.error("Lấy đơn hàng thất bại!");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fectOrders();
  }, [loading]);

  // const handleReviewSubmit = () => {
  //   console.log("Đánh giá đã được gửi:", review);
  //   setShowReviewForm(false); // Đóng modal sau khi gửi đánh giá
  //   message.success("Đánh giá của bạn đã được gửi!");
  // };
  const handleReviewSubmit = () => {
    console.log("Đánh giá đã được gửi:", review);

    // Kiểm tra trước khi gửi
    if (!review.rating || !review.comment) {
      message.error("Vui lòng nhập đầy đủ thông tin đánh giá!");
      return;
    }

    const data = {
      product_id: productId,
      rating: review.rating,
      comment: review.comment,
      image: review.image ? review.image : null,
      order_id: orderId,
    };

    const formData = new FormData();
    formData.append("rating", review.rating.toString());
    formData.append("comment", review.comment);
    if (review.image) {
      formData.append("image", review.image);
    }

    fetch("http://127.0.0.1:8000/api/add-review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Something went wrong!");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Review submitted:", data);
        setShowReviewForm(false); // Đóng modal sau khi gửi đánh giá
        message.success("Đánh giá của bạn đã được gửi!");
        setReview((prevReview) => ({
          ...prevReview,
          rating: 0,
          comment: "",
          image: null,
        }));
        fectOrders();
      })
      .catch((error) => {
        console.error("Error:", error);
        message.error("Đã xảy ra lỗi khi gửi đánh giá!");
      });
  };

  const handleImageUpload = (file: any) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ cho phép tải lên file hình ảnh!");
      return Upload.LIST_IGNORE;
    }
    setReview((prevReview) => ({
      ...prevReview,
      image: file,
    }));
    return false; // Ngăn hành vi tải lên mặc định
  };

  const handleImageRemove = () => {
    setReview((prevReview) => ({
      ...prevReview,
      image: null,
    }));
  };

  const cancel = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/cancel-order/${cancelOrder}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        message.success("Hủy đơn hàng thành công!");
        // Xóa đơn hàng đã hủy kh��i danh sách
        // setOrders(orders.filter((order) => order.id !== selectedOrder.id));
      } else {
        message.error("Hủy đơn hàng thất bại!");
      }
    } catch (error) {
      console.error("Error canceling order:", error);
    }
    setShowCancelForm(false);
  };

  const handleCancelSubmit = async () => {
    if (!selectedReason) {
      message.warning("Vui lòng chọn lý do hủy đơn hàng!");
      return;
    }
    // Xử lý logic hủy đơn hàng tại đây
    // console.log("Lý do hủy:", selectedReason);
    await cancel();

    setShowCancelForm(false);
    await fectOrders();

    // message.success("Hủy đơn hàng thành công!");
  };

  const handleRufundSubmit = async () => {
    if (!selectedReason) {
      message.warning("Vui lòng chọn lý do trả hàng!");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/orders/${refundOrder}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "returned" }),
        }
      );
      if (response.ok) {
        message.success("Trả đơn hàng thành công!");
      } else {
        message.error("Trả đơn hàng thất bại!");
      }
    } catch (error) {
      console.error("Error canceling order:", error);
    }

    setShowRefundForm(false);
    await fectOrders();

    // message.success("Hủy đơn hàng thành công!");
  };
  const handleConfirmOrder = async (orderId: number) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Đảm bảo token hợp lệ
          },
          body: JSON.stringify({
            status: "completed",
          }),
        }
      );

      if (response.ok) {
        message.success("Xác nhận đơn hàng thành công!");
      } else {
        const errorData = await response.json();
        message.error(
          `Xác nhận thất bại! Lỗi: ${errorData.message || "Không rõ"}`
        );
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      message.error(
        "Đã xảy ra lỗi trong quá trình xác nhận. Vui lòng thử lại sau."
      );
    }

    // Cập nhật danh sách đơn hàng (nếu cần)
    await fectOrders();
  };
  // const filteredOrders = Array.isArray(orders)
  //   ? orders.filter((order) => {
  //       const searchLower = searchTerm.toLowerCase();

  //       // Kiểm tra tên sản phẩm trong mảng order_details
  //       const productMatches = Array.isArray(order.order_details)
  //         ? order.order_details.some((detail) =>
  //             detail.name?.toLowerCase().includes(searchLower)
  //           )
  //         : false;

  //       // Kiểm tra mã đơn hàng
  //       const codeMatches = order.order_code
  //         ?.toLowerCase()
  //         .includes(searchLower);

  //       // const statusOrder = order.status === selectedStatus;

  //       return productMatches || codeMatches;
  //     })
  //   : [];

  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const handleTabClick = (status: string | null) => {
    setSelectedStatus(status);
  };

  // let filteredOrders = selectedStatus
  //   ? orders.filter((order) => order.status === selectedStatus)
  //   : orders;

  const handleReorder = async (orderId: number) => {
    const order = orders.filter((order) => order.id === orderId)[0];
    console.log(order);

    const cartItems: CartItem[] = order.order_details.map((detail) => ({
      product_id: detail.product.id,
      color_id: detail.product_variant.color.id,
      size_id: detail.product_variant.size.id,
      quantity: detail.quantity,
      price: detail.product_variant.price,
    }));

    try {
      for (const cartItem of cartItems) {
        const response = await fetch(`http://127.0.0.1:8000/api/cart-add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cartItem),
        });

        if (!response.ok) {
          throw new Error(`Failed to add item to cart: ${cartItem.product_id}`);
        }
      }
      navigate("/carts");
      // alert("Mua lại thành công. Các sản phẩm đã được thêm vào giỏ hàng!");
      message.success("Sản phẩm được thêm vào giỏ hàng!");
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi khi mua lại. Vui lòng thử lại.");
    }
  };
  let filteredOrders = orders;

  if (selectedStatus) {
    filteredOrders = orders.filter((order) => order.status === selectedStatus);
  }

  const filteredBySearch = filteredOrders.filter((order) =>
    order.order_details.some(
      (detail) =>
        detail.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toString().includes(searchTerm)
    )
  );
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/show-user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Lỗi khi lấy thông tin người dùng");
        }
        const data = await response.json();
        console.log(data.data);
        setUser(data.data);
      } catch (e) {
        console.error("L��i khi lấy thông tin người dùng", e);
      }
    };
    fetchUser();
  }, []);
  const getStatusLabel = (status: string) => {
    const statusMapping: { [key: string]: string } = {
      pending: "Đang chờ xử lý",
      shipped: "Đang vận chuyển",
      delivered: "Đã giao hàng",
      completed: "Hoàn thành",
      cancelled: "Đã hủy",
      returned: "Trả hàng/Hoàn tiền",
      refunded: "Đã hoàn tiền",
    };

    return statusMapping[status] || "Không xác định";
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
              <h3>{user?.username}</h3>
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

        <div className="account-info" style={{}}>
          <div className="order-info">
            <div className="order-tabs">
              <button
                className={`order-tab ${!selectedStatus ? "active" : ""}`}
                onClick={() => handleTabClick(null)}
              >
                Tất cả
              </button>
              <button
                className={`order-tab ${
                  selectedStatus === "pending" ? "active" : ""
                }`}
                onClick={() => handleTabClick("pending")}
              >
                Đang chờ xử lý
              </button>
              <button
                className={`order-tab ${
                  selectedStatus === "shipped" ? "active" : ""
                }`}
                onClick={() => handleTabClick("shipped")}
              >
                Đang vận chuyển
              </button>
              <button
                className={`order-tab ${
                  selectedStatus === "delivered" ? "active" : ""
                }`}
                onClick={() => handleTabClick("delivered")}
              >
                Đã giao hàng
              </button>
              <button
                className={`order-tab ${
                  selectedStatus === "completed" ? "active" : ""
                }`}
                onClick={() => handleTabClick("completed")}
              >
                Hoàn thành
              </button>
              <button
                className={`order-tab ${
                  selectedStatus === "cancelled" ? "active" : ""
                }`}
                onClick={() => handleTabClick("cancelled")}
              >
                Đã hủy
              </button>
              <button
                className={`order-tab ${
                  selectedStatus === "returned" ? "active" : ""
                }`}
                onClick={() => handleTabClick("returned")}
              >
                Trả hàng/Hoàn tiền
              </button>
              <button
                className={`order-tab ${
                  selectedStatus === "refunded" ? "active" : ""
                }`}
                onClick={() => handleTabClick("refunded")}
              >
                Đã Hoàn tiền
              </button>
            </div>
            <div
              className="bor17 of-hidden pos-relative"
              style={{ background: "red" }}
            >
              <input
                className="stext-103 cl2 plh4 size-116 p-l-28 p-r-55"
                type="text"
                name="search"
                placeholder="Tìm kiếm tên hoặc mã đơn hàng"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="flex-c-m size-122 ab-t-r fs-18 cl4 hov-cl1 trans-04">
                <i className="zmdi zmdi-search"></i>
              </button>
            </div>
            <div
              style={{
                marginTop: "10px",
                overflow: "auto",
                height: "60vh",
                width: "100%",
              }}
            >
              {Array.isArray(filteredBySearch) &&
                filteredBySearch.map((order, index) => (
                  <div
                    key={index}
                    style={{ border: "solid #b5a5a5 0.2px" }}
                    className="order-item"
                  >
                    <div
                      style={{
                        textAlign: "right",
                      }}
                    >
                      <div
                        style={{
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            // color: "red",
                            textTransform: "capitalize",
                            padding: "5px 10px",
                            backgroundColor: "#f0f0f0",

                            display: "inline-block",
                            marginBottom: "5px",
                          }}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                    </div>
                    {Array.isArray(order.order_details) &&
                      order.order_details.map((detail, detailIndex) => (
                        <div key={detailIndex}>
                          <div className="order-product">
                            <img
                              // src={`http://127.0.0.1:8000/storage/${detail.product_variant?.images[0].image_url}`}
                              src={`http://127.0.0.1:8000/storage/${detail.product_variant?.images[0].image_url}`}
                              alt="Sản phẩm A"
                              className="order-product-image"
                            />
                            <div className="order-product-info">
                              <p className="order-product-name">
                                {detail.product.name}
                              </p>
                              <p className="order-product-variant">
                                Phân loại:{" "}
                                {detail.product_variant.size.size_name},
                                {detail.product_variant.color.color_name}
                              </p>
                              <p className="order-product-quantity">
                                Số lượng: {detail.quantity}
                              </p>
                            </div>
                            <p className="order-product-price">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(
                                parseFloat(
                                  detail.product_variant.price.toString()
                                )
                              )}{" "}
                            </p>
                          </div>
                          <>{console.log(detail.order_id)}</>
                          {order.status === "completed" &&
                            order.reviews.length == 0 && (
                              // <Link to={`/products/${order.pro}`}>
                              <div style={{ marginLeft: "60px" }}>
                                <button
                                  style={{
                                    backgroundColor: "red",
                                    margin: "5px",
                                    color: "white",
                                    marginLeft: "903px",
                                    width: "90px",
                                  }}
                                  className="order-btn order-btn-reorder"
                                  onClick={() => {
                                    setShowReviewForm(true);
                                    setProductId(detail.product.id);
                                    setOderId(detail.order_id);
                                  }}
                                >
                                  Đánh giá
                                </button>
                              </div>
                              // </Link>
                            )}
                        </div>
                      ))}
                    <div className="order-item-footer">
                      <span className="order-total-label">Thành tiền:</span>
                      <span className="order-total-price">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(Number(order.total_amount))}
                      </span>
                    </div>

                    <div className="order-item-actions">
                      {order.status == "pending" && (
                        <div>
                          <button
                            className="order-btn order-btn-detail"
                            onClick={() => {
                              setShowCancelForm(true); // Hiển thị form hủy đơn
                              setCanceldOrder(order.id); // Cập nhật ID đơn hàng cần hủy
                            }}
                          >
                            Hủy đơn hàng
                          </button>

                          <button
                            style={{
                              backgroundColor: "red",
                              margin: "5px",
                              color: "white",
                            }}
                            className="order-btn order-btn-detail"
                            onClick={() => {
                              // Logic để xem chi tiết đơn hàng, chẳng hạn như chuyển hướng hoặc hiển thị thông tin
                              window.location.href = `/order-detail/${order.id}`;
                            }}
                          >
                            Xem chi tiết đơn hàng
                          </button>
                        </div>
                      )}
                      {order.status === "delivered" && (
                        <div>
                          {/* Hiển thị chữ "đã giao hàng" */}
                          <button
                            className="order-btn order-btn-detail"
                            onClick={() => {
                              setShowRefundForm(true); // Hiển thị form hủy đơn
                              setRefunddOrder(order.id); // Cập nhật ID đơn hàng cần hủy
                            }}
                          >
                            Trả Hàng
                          </button>
                          <button
                            style={{
                              backgroundColor: "red",
                              margin: "5px",
                              color: "white",
                            }}
                            className="order-btn order-btn-reorder"
                            onClick={() => showConfirm(order.id)} // Sửa lại để gọi showConfirm
                          >
                            Đã nhận hàng
                          </button>
                        </div>
                      )}
                      {order.status == "shipped" && (
                        <button
                          style={{
                            backgroundColor: "red",
                            margin: "5px",
                            color: "white",
                          }}
                          className="order-btn order-btn-detail"
                          onClick={() => {
                            // Logic để xem chi tiết đơn hàng, chẳng hạn như chuyển hướng hoặc hiển thị thông tin
                            window.location.href = `/order-detail/${order.id}`;
                          }}
                        >
                          Xem chi tiết đơn hàng
                        </button>
                      )}
                      {order.status == "completed" && (
                        // <Link to={`/products/${order.pro}`}>
                        <div
                          style={{
                            width: "90px",
                          }}
                        >
                          <button
                            style={{
                              width: "90px",
                            }}
                            className="order-btn order-btn-reorder"
                            // onClick={() => setShowReviewForm(true)}
                            onClick={() => showConfirm(order.id)}
                          >
                            Mua Lại
                          </button>

                          {/* <button
                            style={{
                              backgroundColor: "red",
                              margin: "5px",
                              color: "white",
                            }}
                            className="order-btn order-btn-reorder"
                            onClick={() => setShowReviewForm(true)}
                          >
                            Đánh giá
                          </button> */}
                        </div>
                        // </Link>
                      )}
                      {order.status == "refunded" && (
                        <button
                          className="order-btn order-btn-reorder"
                          onClick={() => handleReorder(order.id)}
                        >
                          Mua Lại
                        </button>
                      )}
                      {order.status == "returned" && (
                        <button
                          className="order-btn order-btn-reorder"
                          onClick={() => handleReorder(order.id)}
                        >
                          Mua Lại
                        </button>
                      )}
                      {order.status == "cancelled" && (
                        <button
                          className="order-btn order-btn-reorder"
                          onClick={() => handleReorder(order.id)}
                        >
                          Mua Lại
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Modal đánh giá */}
        {/* <Modal
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
              listType="picture-card"
              maxCount={1} // Chỉ cho phép 1 ảnh
              beforeUpload={handleImageUpload}
              onRemove={handleImageRemove}
            >
              {!review.image && (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Tải lên</div>
                </div>
              )}
            </Upload>
          </div>
        </Modal> */}
        <Modal
          title="Viết đánh giá của bạn"
          visible={showReviewForm}
          onCancel={() => setShowReviewForm(false)}
          footer={[
            <Button key="back" onClick={() => setShowReviewForm(false)}>
              Đóng
            </Button>,
            <Button key="submit" type="primary" onClick={handleReviewSubmit}>
              Gửi đánh giá
            </Button>,
          ]}
        >
          <div>
            <Rate
              value={review.rating}
              onChange={(value) => setReview({ ...review, rating: value })}
            />
            <Input.TextArea
              placeholder="Viết đánh giá của bạn"
              value={review.comment}
              onChange={(e) =>
                setReview({ ...review, comment: e.target.value })
              }
            />
            <Upload
              beforeUpload={handleImageUpload}
              onRemove={handleImageRemove}
              listType="picture-card"
              showUploadList={review.image ? { showRemoveIcon: true } : false}
            >
              {review.image ? (
                <img
                  src={review.image}
                  alt="Uploaded"
                  style={{ width: "100px" }}
                />
              ) : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                </div>
              )}
            </Upload>
          </div>
        </Modal>

        {/* Modal hủy đơn hàng */}
        <Modal
          title="Lý Do Hủy"
          visible={showCancelForm}
          onCancel={() => setShowCancelForm(false)}
          footer={[
            // <Button key="cancel" onClick={() => setShowCancelForm(false)}>
            //   KHÔNG PHẢI BÂY GIỜ
            // </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={handleCancelSubmit}
              disabled={!selectedReason} // Vô hiệu hóa nếu chưa chọn lý do
            >
              Hủy Đơn Hàng
            </Button>,
          ]}
        >
          <div style={{ marginBottom: "15px", color: "#FF8800" }}>
            <em>Chọn lý do hủy phù hợp nhất với bạn nhé!</em>
          </div>
          <Radio.Group
            onChange={(e) => setSelectedReason(e.target.value)}
            value={selectedReason}
          >
            {cancelReasons.map((reason, index) => (
              <Radio key={index} value={reason}>
                {reason}
              </Radio>
            ))}
          </Radio.Group>
        </Modal>

        {/* Modal Trả đơn hàng */}
        <Modal
          title="Lý Do Trả"
          visible={showRefundForm}
          onCancel={() => setShowRefundForm(false)}
          footer={[
            // <Button key="cancel" onClick={() => setShowCancelForm(false)}>
            //   KHÔNG PHẢI BÂY GIỜ
            // </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={handleRufundSubmit}
              disabled={!selectedReason} // Vô hiệu hóa nếu chưa chọn lý do
            >
              Trả Đơn Hàng
            </Button>,
          ]}
        >
          <div style={{ marginBottom: "15px", color: "#FF8800" }}>
            <em>Chọn lý do trả phù hợp nhất với bạn nhé!</em>
          </div>
          <Radio.Group
            onChange={(e) => setSelectedReason(e.target.value)}
            value={selectedReason}
          >
            {refundReasons.map((reason, index) => (
              <Radio key={index} value={reason}>
                {reason}
              </Radio>
            ))}
          </Radio.Group>
        </Modal>
      </div>
    </div>
  );
};

export default OrderList;
