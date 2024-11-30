import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input, List, Modal, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import AddAddress from "../../components/AddAddress";
import axios from "axios";
interface Cart {
  id: number;
  cart_id: number;
  product_id: number;
  variant_id: number | null;
  quantity: number;
  product_price: string;
  discount_value: string;
  product: {
    id: number;
    name: string;
    sku: string;
    description: string;
    category_id: number;
    stock: number;
    // price: number;
    is_active: number;
    image: {
      id: number;
      product_id: number;
      variant_id: number;
      alt_text: string;
      image_url: string;
    };
  };
  product_variant: {
    id: number;
    product_id: number;
    size_id: number;
    color_id: number;
    price: number;
    stock: number;
    size: {
      id: number;
      size_name: string;
    };
    color: {
      id: number;
      color_name: string;
    };
  };
}

interface Address {
  id: number;
  user_id: number;
  recipient_name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  is_default: number;
}
interface Order {
  total_amount: number;
  promotion_id: number | undefined;
  address_id: number;
  payment_method: string;
  shipping_cost: number;
  carts_detail: number[];
}

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();

  const [isFirstPage, setIsFirstPage] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const cartDetailIdsRedux = useSelector(
    (state: RootState) => state.CartDetail.ids
  );
  const [carts, setCarts] = useState<Cart[]>([]);
  const token = localStorage.getItem("access_token");
  const savedCartDetailOrder: number[] = JSON.parse(
    localStorage.getItem("cartDetailOrder") || "[]"
  );
  const [addressId, setAddressId] = useState<number>();
  const [address, setAddress] = useState<Address[]>([]);
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
  const [order, setOrderdata] = useState<Order>();
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [idVoucher, setIdVoucher] = useState<number>();
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    // setTimeout(() => {
    if (address) {
      const defaultAddress =
        address.filter((address) => address.is_default == 1)[0] || null;
      setDefaultAddress(defaultAddress);
    }
    // }, 200);
  }, [address]);

  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const checkPrime = (e: any, id: number | string) => {
    console.log("run");
    if (e.target.checked) {
      id = Number(id);
      setAddressId(id);
    }
  };

  const [discountCodes, setDiscountCodes] = useState<
    { code: string; description: string }[]
  >([]);
  const [isDiscountModalVisible, setIsDiscountModalVisible] = useState(false);

  // Hàm mở modal
  const showDiscountModal = () => {
    setIsDiscountModalVisible(true);
  };

  // Hàm đóng modal
  const handleCancelDiscount = () => {
    setIsDiscountModalVisible(false);
  };

  // Lấy mã giảm giá từ API
  const fetchDiscountCodes = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/promotions`, {
        // Thay đổi URL API của bạn
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Không thể lấy mã giảm giá.");
      }

      const data = await response.json();
      // Giả sử API trả về danh sách mã giảm giá trong trường 'discounts'
      setDiscountCodes(data.discounts || []);
    } catch (error) {
      message.error("Đã có lỗi khi tải mã giảm giá");
    }
  };
  useEffect(() => {
    fetchDiscountCodes();
  }, []);
  // Sử dụng useEffect để gọi API khi component mount
  useEffect(() => {
    fetchDiscountCodes();
    setIsFirstPage(false);
  }, []);
  useEffect(() => {
    setTotalAmount(
      carts.reduce((sum, cart) => {
        return sum + cart.product_variant.price * cart.quantity;
      }, 0)
    );
  }, [carts]);
  // call api update địa chỉ
  const updateAddress = async () => {
    // try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/update-address-user`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: addressId }), // Đưa body ra ngoài headers
      }
    );
    if (response.ok) {
      const data = await response.json();
      setAddress(data.addresses);
    }
  };
  useEffect(() => {
    if (isFirstPage == false) {
      console.log("running first page");
      updateAddress();
    }
    console.log("dont running first page");
  }, [addressId]);
  // call api chi tiết giỏ hàng

  // call api địa chỉ người dùng
  const get = async () => {
    // try {
    const response = await fetch(`http://127.0.0.1:8000/api/get-adrress-user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setAddress(data.data);
    }
    // } catch (error) {
    //   message.error("Đã có lỗi xảy ");
    // }
  };
  useEffect(() => {
    const get = async (ids: number[]) => {
      // try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/carts-detail-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ids }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setCarts(data.cart_details);
      }
    };
    get(savedCartDetailOrder);
  }, []);

  useEffect(() => {
    get();
  }, [addressId]);
  // Hàm mở modal
  const showModal = () => {
    setIsModalVisible(true);
  };
  // Hàm đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const submitOrder = async () => {
    if (!defaultAddress) {
      message.error("Vui lòng chọn địa chỉ nhận hàng");
      return;
    }
    if (!paymentMethod) {
      message.error("Vui lòng chọn phương thức thanh toán");
      return;
    }
    if (paymentMethod === "vnpay") {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/payment-vnpay",
          {
            amount: totalAmount,
            bank_code: "NCB",
          }
        );
        window.location.href = response.data.data;
        console.log(response.data.data);
      } catch (error) {
        console.error("Error creating payment:", error);
        return;
      }
    }
    const orderData: Order = {
      total_amount: totalAmount,
      promotion_id: idVoucher,
      address_id: defaultAddress.id,
      payment_method: paymentMethod,
      shipping_cost: 30000,
      carts_detail: savedCartDetailOrder,
    };
    setOrderdata(orderData);

    // call api order
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const data = await response.json();
        setOrderdata(data);
        message.success("Đặt hàng thành công!");

        navigate(`/ordersuccess/${data.order.id}`);
      } else {
        message.error("Đặt hàng thất bại, vui lòng thử lại.");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi tạo đơn hàng.");
    }
  };

  const submit = async () => {
    get();
  };

  const checkVoucher = async () => {
    if (code.trim() === "") {
      message.error("Vui lòng nhập mã giảm giá");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code: code }),
      });
      const data = await response.json();
      console.log(data.status);

      if (data.status == false) {
        // Xử lý khi phản hồi từ server không thành công
        console.log(data.message);
        message.error(data.message || "Đã xảy ra lỗi khi kiểm tra mã giảm giá");
        return;
      }

      const voucher = data.data;
      console.log(voucher);

      // Kiểm tra điều kiện sử dụng mã giảm giá
      if (voucher.min_purchase_amount > totalAmount) {
        message.error("Tổng giá trị đơn hàng không đủ để áp dụng mã giảm giá");
        return;
      }

      if (voucher.discount_type === "percentage") {
        setIdVoucher(voucher.id);
        // Áp dụng giảm giá phần trăm
        setTotalAmount((prev) => prev - (prev * voucher.discount_value) / 100);
      } else if (voucher.discount_type === "fixed_amount") {
        setIdVoucher(voucher.id);

        // Áp dụng giảm giá số tiền cố định
        setTotalAmount((prev) => prev - voucher.discount_value);
      } else {
        message.error("Loại mã giảm giá không hợp lệ");
        return;
      }

      message.success("Mã giảm giá được áp dụng thành công!");
    } catch (error) {
      console.error("Lỗi khi kiểm tra mã giảm giá:", error);
      message.error("Không thể kiểm tra mã giảm giá. Vui lòng thử lại sau");
    }
  };

  return (
    <form className="bg0 p-t-75 p-b-85">
      <div className="container">
        <div className="row">
          <div
            className="col-lg-10 col-xl-7 m-lr-auto m-b-50"
            style={{ marginBottom: "20px" }}
          >
            <div className="m-l-25 m-r--38 m-lr-0-xl">
              <div className="wrap-table-shopping-cart">
                <table className="table-shopping-cart">
                  <thead>
                    <tr className="table_head">
                      <th className="column-1">Sản phẩm</th>
                      <th className="column-2"></th>
                      <th className="column-3">Đơn Giá</th>
                      <th className="column-4">Số lượng</th>
                      <th className="column-5">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(carts) &&
                      carts.map((cart, index) => (
                        <tr className="table_row" key={index}>
                          <td className="column-1">
                            <img
                              src={`http://127.0.0.1:8000/storage/${
                                cart?.product.image?.image_url ||
                                "default-image.jpg"
                              }`}
                              alt="IMG-PRODUCT"
                              style={{
                                width: "120px",
                                height: "150px",
                                objectFit: "cover",
                                borderRadius: "4px",
                              }}
                            />
                          </td>

                          <td
                            className="column-2"
                            style={{
                              paddingLeft: "50px",
                            }}
                          >
                            {cart.product.name}
                            {cart.product_variant && (
                              <p className="text-gray-500 text-sm">
                                Kích thước:{" "}
                                {cart.product_variant.size.size_name}, Màu sắc:{" "}
                                {cart.product_variant.color.color_name}
                              </p>
                            )}
                          </td>
                          <td className="column-3">
                            {cart.product_variant.price
                              ? Number(
                                  cart.product_variant.price
                                ).toLocaleString() + "₫"
                              : "Không xác định"}
                          </td>
                          <td className="column-4">
                            <p>{cart.quantity}</p>
                          </td>
                          <td className="column-5">
                            {(
                              cart.product_variant.price * cart.quantity
                            ).toLocaleString()}
                            ₫
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <div
                  className="note-seller mt-4"
                  style={{
                    height: "40px",
                    display: "flex",
                    justifyContent: "space-evenly",
                  }}
                >
                  <div style={{ width: "10%" }}>
                    <label
                      htmlFor="note-seller"
                      className="text-bold"
                      style={{ marginLeft: "12px", fontWeight: "bold" }}
                    >
                      Lời nhắn :
                    </label>
                  </div>

                  <div
                    style={{
                      width: "80%",
                      marginTop: "-10px",
                    }}
                  >
                    <textarea
                      id="note-seller"
                      className="form-control"
                      placeholder="Lưu ý cho người bán"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="col-lg-10 col-xl-7 m-lr-auto m-b-50"
            style={{ marginBottom: "20px" }}
          >
            <div className="bor10 p-lr-40 p-t-30 p-b-40 m-l-63 m-r-40 m-lr-0-xl p-lr-15-sm">
              <div className="flex-w flex-sb-m bor15 p-t-18 p-b-15 p-lr-40 p-lr-15-sm">
                <div className="flex-w flex-m m-r-20 m-tb-5">
                  <input
                    className="stext-104 cl2 plh4 size-117 bor13 p-lr-20 m-r-10 m-tb-5"
                    type="text"
                    name="coupon"
                    placeholder="Mã giảm giá"
                    onChange={(e) => setCode(e.target.value)}
                  />

                  <div
                    className="flex-c-m stext-101 cl2 size-118 bg8 bor13 hov-btn3 p-lr-15 trans-04 pointer m-tb-5"
                    onClick={checkVoucher}
                  >
                    Áp dụng
                  </div>
                </div>

                <div className="flex-c-m stext-101 cl2 size-119 bg8 bor13 hov-btn3 p-lr-15 trans-04 pointer m-tb-10">
                  <div>
                    {/* Thêm nút để mở modal danh sách mã giảm giá */}
                    <Button onClick={showDiscountModal}>Xem mã giảm giá</Button>

                    {/* Modal hiển thị danh sách mã giảm giá */}
                    <Modal
                      title="Mã giảm giá"
                      visible={isModalVisible}
                      onCancel={handleCancel}
                      footer={null} // Không hiển thị các nút "OK" và "Cancel"
                    >
                      <ul>
                        {discountCodes.length > 0 ? (
                          discountCodes.map((discount, index) => (
                            <li key={index}>
                              {discount.code} - {discount.description}
                            </li>
                          ))
                        ) : (
                          <p>Không có mã giảm giá nào.</p>
                        )}
                      </ul>
                    </Modal>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-10 col-xl-7 m-lr-auto m-b-50">
            <div className="bor10 p-lr-40 p-t-30 p-b-40 m-l-63 m-r-40 m-lr-0-xl p-lr-15-sm">
              <div className="flex-w flex-t bor12 p-t-15 p-b-30">
                <div className="label size-208 w-full-ssm mt-3">
                  <span
                    className="text-lg text-gray-700 "
                    style={{ fontSize: "15px", fontWeight: "bold" }}
                  >
                    <i className="fa-solid fa-location-dot"></i> Địa chỉ:
                  </span>
                </div>

                <div className="address-card">
                  <div className="address-content">
                    <span
                      className="address-name"
                      style={{ fontSize: "14px", fontWeight: "bold" }}
                    >
                      {defaultAddress?.recipient_name}
                    </span>{" "}
                    |
                    <span
                      className="address-phone"
                      style={{ fontSize: "14px", fontWeight: "bold" }}
                    >
                      {" "}
                      {defaultAddress?.phone}
                    </span>
                    <br />
                    <span
                      className="address-details"
                      style={{ marginLeft: "10px" }}
                    >
                      {defaultAddress?.address_line}-{defaultAddress?.state}-
                      {defaultAddress?.city}
                    </span>
                    <Button style={{ marginLeft: "220px" }}>
                      <a href="#" className="change-link" onClick={showModal}>
                        Thay Đổi
                      </a>
                    </Button>
                  </div>

                  <Modal
                    title="Địa chỉ của tôi"
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                    centered
                    width={800}
                    style={{ justifyContent: "center" }}
                  >
                    <div
                      className="address-inputs"
                      style={{
                        padding: "10px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "15px",
                        justifyContent: "center",
                      }}
                    >
                      {/* Địa chỉ hiện tại */}
                      <div
                        className="address-card"
                        style={{
                          padding: "15px",
                          backgroundColor: "#f9f9f9",
                          borderRadius: "8px",
                          marginBottom: "15px",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                        }}
                      >
                        {address?.map((address, index) => (
                          <div
                            key={index}
                            className="address-content"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "10px",
                              marginLeft: "30px",
                            }}
                          >
                            <input
                              type="radio"
                              name="address"
                              checked={address.is_default === 1}
                              className="address-checkbox"
                              style={{ marginRight: "15px" }}
                              onChange={(e) => checkPrime(e, address.id)}
                            />
                            <span
                              className="address-name"
                              style={{
                                fontSize: "14px",
                                fontWeight: "600",
                                color: "#333",
                                marginRight: "10px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {address.recipient_name}
                            </span>
                            |
                            <span
                              className="address-phone"
                              style={{
                                fontSize: "14px",
                                fontWeight: "600",
                                color: "#333",
                                marginLeft: "10px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {address.phone}
                            </span>
                            <br />
                            <span
                              className="address-details"
                              style={{
                                fontSize: "13px",
                                color: "#666",
                                lineHeight: "1.5",
                                marginLeft: "30px",
                              }}
                            >
                              {address.address_line}-{address.state}-
                              {address.city}
                            </span>
                            <Button
                              className="update address"
                              style={{
                                display: "flex",
                                marginLeft: "90px",
                                color: "#666",
                              }}
                            >
                              Cập nhật
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div
                        style={{
                          display: "flex", // Sử dụng Flexbox
                          justifyContent: "center", // Căn giữa theo chiều ngang
                          alignItems: "center", // Căn giữa theo chiều dọc
                        }}
                      >
                        <AddAddress onAddSuccess={get} />
                      </div>
                    </div>
                  </Modal>
                </div>
              </div>
              <div className="flex-w flex-t bor12 p-t-15 p-b-30">
                <div className="label size-208 w-full-ssm mt-3">
                  <span
                    className="text-lg text-gray-700 "
                    style={{ fontSize: "15px", fontWeight: "bold" }}
                  >
                    <i className="fa-regular fa-credit-card"></i> Phương thức
                    thanh toán
                  </span>
                </div>

                <div className="address-inputs size-209 p-x-18 p-x-0-sm w-full-ssm ">
                  <div className="p-y-15">
                    <div className="select-country bg-white mb-3 mt-2">
                      <select
                        className="w-full p-2"
                        name="country"
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      >
                        <option value={""}>Chọn phương thức thanh toán</option>
                        <option value={"cod"}>Thanh toán khi nhận hàng</option>
                        <option value={"vnpay"}>Thanh toán bằng VN Pay</option>
                        <option value={"momo"}>Thanh toán bằng Momo</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-w flex-t p-t-27 p-b-33">
                <div className="size-208">
                  <span
                    className="mtext-101 cl2"
                    style={{ fontSize: "15px", fontWeight: "bold" }}
                  >
                    <i className="fa-solid fa-money-bill-wave"></i> Tổng tiền
                  </span>
                </div>

                <div className="size-209 p-t-1">
                  <span
                    className="mtext-110 cl2"
                    style={{
                      fontSize: "25px",
                      fontWeight: "bold",
                      color: "red",
                    }}
                  >
                    {totalAmount.toLocaleString()}₫
                  </span>
                </div>
              </div>

              <Link to="/payments">
                <button
                  className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer"
                  onClick={() => submitOrder()}
                >
                  Đặt hàng
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PaymentPage;
