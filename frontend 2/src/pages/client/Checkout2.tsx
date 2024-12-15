import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input, List, Modal, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import AddAddress from "../../components/AddAddress";
import Pusher from "pusher-js";
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
interface Promotion {
  id: number;
  code: string;
  discount_type: "money" | "percentage" | "shipping";
  discount_value: number;
  usage_limit: number;
  start_date: string;
  end_date: string;
  is_active: number;
  max_discount: number;
  min_purchase_amount: string | null;
  tier_id: number;
  created_at: string | null;
  updated_at: string;
}

interface DiscountData {
  discount_money: Promotion[]; // Dùng object với key là ID
  discount_percentage: Promotion[]; // Dùng array cho phần trăm
  discount_shipping: Promotion[]; // Dùng object với key là ID
}

interface Res {
  status: boolean; //
  message: string;
  data: Cart;
}

const PaymentPage2: React.FC = () => {
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(window.location.search);
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
  const [searchTerm, setSearchTerm] = useState("");
  const [order, setOrderdata] = useState<Order>();
  const [loading, setLoading] = useState("");
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  const [originalTotalAmount, setOriginalTotalAmount] = useState<number>(0);
  useEffect(() => {
    console.log(originalTotalAmount);
  }, [originalTotalAmount]);
  const [idVoucher, setIdVoucher] = useState<number>();
  // const [idShip, setIdShip] = useState<number>();
  const [idShip, setIdShip] = useState<number | null | undefined>();
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [addressId, setAddressId] = useState<number>();
  const [address, setAddress] = useState<Address[]>([]);
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
  const [vouchers, setVouchers] = useState<DiscountData>();

  const [checkout, setCheckout] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (address) {
        const defaultAddress =
          address.filter((address) => address.is_default == 1)[0] || null;
        setDefaultAddress(defaultAddress);
      }
    }, 200);
  }, [address]);

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

  // Kiểu cho các tham số
  const checkPrime = (
    // e: React.ChangeEvent<HTMLInputElement>,
    addressId: number
  ) => {
    // Cập nhật trạng thái của địa chỉ mới được chọn
    const updatedAddresses = address.map((addr) => {
      if (addr.id === addressId) {
        return { ...addr, is_default: 1 };
      }
      return { ...addr, is_default: 0 };
    });

    // Cập nhật lại state của địa chỉ
    setAddress(updatedAddresses);
  };
  // call api update địa chỉ
  const updateAddress = async () => {
    // try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/update-default-address-user`,
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
  }, [addressId]);
  // call api chi tiết giỏ hàng

  // call api địa chỉ người dùng
  const get = async () => {
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
  };
  useEffect(() => {
    get();
  }, []);

  const getCartDetail = async (ids: number[]) => {
    try {
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
        const updatedCarts = data.cart_details
          .map((cart: any) => {
            // Xử lý khi sản phẩm hết hàng
            if (cart.product_variant.stock === 0) {
              message.warning(
                `Sản phẩm "${cart.product_variant.name}" đã hết hàng và bị xóa khỏi giỏ hàng.`
              );
              return null;
            }
            // Xử lý khi số lượng không đủ
            if (cart.quantity > cart.product_variant.stock) {
              message.warning(
                `Sản phẩm "${cart.product_variant.name}" chỉ còn lại ${cart.product_variant.stock}. Số lượng đã được cập nhật.`
              );
              return { ...cart, quantity: cart.product_variant.stock };
            }
            return cart;
          })
          .filter(Boolean); // Loại bỏ sản phẩm null (hết hàng)

        setCarts(updatedCarts);

        // Tính lại tổng số tiền
        const amount = updatedCarts.reduce(
          (sum: number, cart: any) =>
            sum + cart.product_variant.price * cart.quantity,
          0
        );
        setOriginalTotalAmount(amount);
      }
    } catch (error) {
      console.error("Error fetching cart details:", error);
    }
  };

  useEffect(() => {
    if (savedCartDetailOrder.length > 0) {
      getCartDetail(savedCartDetailOrder);
    }
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
          Authorization: `Bearer ${token}`,
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

  // Hàm mở modal
  const showModal = () => {
    setIsModalVisible(true);
  };
  // Hàm đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const submitOrder = async () => {
    // Kiểm tra địa chỉ và phương thức thanh toán
    if (!defaultAddress) {
      message.error("Vui lòng chọn địa chỉ nhận hàng");
      return;
    }
    if (!paymentMethod) {
      message.error("Vui lòng chọn phương thức thanh toán");
      return;
    }

    // Nếu phương thức thanh toán là VNPAY
    if (paymentMethod === "vnpay") {
      try {
        isOrderReady();
        const response = await axios.post(
          "http://localhost:8000/api/vnpay/create-payment",
          {
            amount: totalAmount, // Số tiền
            description: "Thanh toán đơn hàng", // Thông tin mô tả đơn hàng
          }
        );

        const data = response.data;

        if (data.data) {
          setCheckout(true);
          // Chuyển hướng đến URL thanh toán VNPay
          window.location.href = data.data;
        }
      } catch (error) {
        console.error("Payment Error:", error);
      }
    } else {
      await createOrder();
    }
  };

  // Check order
  useEffect(() => {
    const checkOrder = async () => {
      const checkResponse = await fetch(
        `http://127.0.0.1:8000/api/carts-detail-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ids: savedCartDetailOrder }),
        }
      );
      if (!checkResponse.ok) {
        const errorData = await checkResponse.json();
        message.error(
          `Không thể kiểm tra tồn kho: ${
            errorData.message || "Lỗi không xác định"
          }`
        );
        return;
      }

      const checkData = await checkResponse.json();
      const updatedCarts = checkData.cart_details
        .map((cart: any) => {
          if (cart.product_variant.stock === 0) {
            message.warning(
              `Sản phẩm "${cart.product_variant.name}" đã hết hàng và bị xóa khỏi giỏ hàng.`
            );
            navigate("/carts");
            return null;
          }
          if (cart.quantity > cart.product_variant.stock) {
            // getCartDetail(savedCartDetailOrder);
            message.warning(
              `Sản phẩm "${cart.product_variant.name}" chỉ còn ${cart.product_variant.stock}. Số lượng đã được cập nhật.`
            );
            navigate("/carts");

            // navigate("/carts");
            return { ...cart, quantity: cart.product_variant.stock };
          }
          return cart;
        })
        .filter(Boolean);

      // if (updatedCarts.length === 0) {
      //   message.error("Không còn sản phẩm hợp lệ trong giỏ hàng.");
      //   navigate("/carts");

      //   return;
      // }
    };
    setTimeout(() => {
      if (loading != "" && checkout == false) {
        console.log("running order");
        checkOrder();
      }
    }, 1000);
  }, [loading]);

  // Check if order is ready
  const isOrderReady = async () => {
    const checkResponse = await fetch(
      `http://127.0.0.1:8000/api/carts-detail-order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids: savedCartDetailOrder }),
      }
    );

    if (!checkResponse.ok) {
      const errorData = await checkResponse.json();
      message.error(
        `Không thể kiểm tra tồn kho: ${
          errorData.message || "Lỗi không xác định"
        }`
      );
      return;
    }

    const checkData = await checkResponse.json();
    const updatedCarts = checkData.cart_details
      .map((cart: any) => {
        if (cart.product_variant.stock === 0) {
          message.warning(
            `Sản phẩm "${cart.product_variant.name}" đã hết hàng và bị xóa khỏi giỏ hàng.`
          );
          return null;
        }
        if (cart.quantity > cart.product_variant.stock) {
          message.warning(
            `Sản phẩm "${cart.product_variant.name}" chỉ còn ${cart.product_variant.stock}. Số lượng đã được cập nhật.`
          );
          return { ...cart, quantity: cart.product_variant.stock };
        }
        return cart;
      })
      .filter(Boolean);

    if (updatedCarts.length === 0) {
      message.error("Không còn sản phẩm hợp lệ trong giỏ hàng.");
      return;
    }

    setCarts(updatedCarts);
    // Tính lại tổng tiền
    const amount = updatedCarts.reduce(
      (sum: number, cart: any) =>
        sum + cart.product_variant.price * cart.quantity,
      0
    );

    // Gửi yêu cầu tạo đơn hàng
    localStorage.setItem(
      "orderData",
      JSON.stringify({
        total_amount: amount,
        discount_promotion_id: idVoucher ? idVoucher : null,
        shipping_promotion_id: idShip ? idShip : null,
        address_id: defaultAddress?.id,
        payment_method: paymentMethod,
        shipping_cost: 31000,
        carts_detail: savedCartDetailOrder,
      })
    );
  };

  // const handlePaymentStatus = async () => {
  //   try {
  //     // Giả sử bạn nhận trạng thái thanh toán từ callback (VNPay trả về thông qua vnp_ReturnUrl)
  //     const urlParams = new URLSearchParams(window.location.search);
  //     const vnp_ResponseCode = urlParams.get("vnp_ResponseCode"); // Mã phản hồi giao dịch

  //     if (vnp_ResponseCode == "00") {
  //       await createOrder(); //

  //       // setPaymentStatus("Thanh toán thành công");
  //       // Bạn có thể tạo đơn hàng hoặc xử lý logic khác ở đây
  //     } else {
  //       // setPaymentStatus(`Thanh toán thất bại, mã lỗi: ${vnp_ResponseCode}`);
  //     }
  //   } catch (error) {
  //     console.error("Error checking payment status:", error);
  //     message.error("thanh toán thất bại");
  //     // setPaymentStatus("Có lỗi trong quá trình kiểm tra thanh toán");
  //   }
  // };

  // // Gọi hàm handlePaymentStatus khi trang được tải lại (URL callback)
  // React.useEffect(() => {
  //   if (window.location.search) {
  //     handlePaymentStatus(); // Kiểm tra trạng thái thanh toán
  //   }
  // }, []);

  // useEffect(() => {
  //   if (window.location.href === "http://localhost:3000/ordersuccess") {
  //     createOrder(); //
  //   }
  // }, []);
  useEffect(() => {
    console.log(idVoucher);
  }, [idVoucher]);

  const createOrder = async () => {
    // try {
    // Kiểm tra tồn kho trước khi tạo đơn hàng
    const checkResponse = await fetch(
      `http://127.0.0.1:8000/api/carts-detail-order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids: savedCartDetailOrder }),
      }
    );

    if (!checkResponse.ok) {
      const errorData = await checkResponse.json();
      message.error(
        `Không thể kiểm tra tồn kho: ${
          errorData.message || "Lỗi không xác định"
        }`
      );
      return;
    }

    const checkData = await checkResponse.json();
    const updatedCarts = checkData.cart_details
      .map((cart: any) => {
        if (cart.product_variant.stock === 0) {
          message.warning(
            `Sản phẩm "${cart.product_variant.name}" đã hết hàng và bị xóa khỏi giỏ hàng.`
          );
          return null;
        }
        if (cart.quantity > cart.product_variant.stock) {
          message.warning(
            `Sản phẩm "${cart.product_variant.name}" chỉ còn ${cart.product_variant.stock}. Số lượng đã được cập nhật.`
          );
          return { ...cart, quantity: cart.product_variant.stock };
        }
        return cart;
      })
      .filter(Boolean);

    if (updatedCarts.length === 0) {
      message.error("Không còn sản phẩm hợp lệ trong giỏ hàng.");
      return;
    }

    setCarts(updatedCarts);

    // Tính lại tổng tiền
    const amount = updatedCarts.reduce(
      (sum: number, cart: any) =>
        sum + cart.product_variant.price * cart.quantity,
      0
    );

    // Gửi yêu cầu tạo đơn hàng
    const orderData = {
      total_amount: amount,
      discount_promotion_id: idVoucher ? idVoucher : null,
      shipping_promotion_id: idShip ? idShip : null,
      address_id: defaultAddress?.id,
      // address_id: 1,
      payment_method: paymentMethod,
      shipping_cost: 31000,
      carts_detail: savedCartDetailOrder,
    };
    console.log(orderData);

    const response = await fetch(`http://127.0.0.1:8000/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      message.error(
        `Đặt hàng thất bại: ${errorData.message || "Lỗi không xác định"}`
      );
      return;
    }

    const res: Res = await response.json();

    if (res.status) {
      message.success("Đặt hàng thành công!");
      localStorage.setItem("order_id", res.data.id.toString());
      navigate(`/ordersuccess/${res.data.id}`);
    } else {
      message.error(res.message || "Đặt hàng thất bại.");
    }
    // } catch (error) {
    //   message.error("Có lỗi xảy ra khi tạo đơn hàng.");
    //   console.error("Error creating order:", error);
    // }
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
      } else if (voucher.discount_type === "money") {
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

  const updateOrderAddress = (selectedAddress: Address) => {
    console.log("Cập nhật địa chỉ cho đơn hàng: ", selectedAddress);
  };

  const handleUpdateAddress = () => {
    const selectedAddress = address.find((addr) => addr.is_default === 1);

    if (selectedAddress) {
      updateOrderAddress(selectedAddress);
    } else {
      alert("Vui lòng chọn một địa chỉ!");
    }
  };

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
        // if (Array.isArray(data.data)) {
        setVouchers(data.data);
        // } else {
        //   console.error("Dữ liệu API không hợp lệ:", data);
        // }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };

    fetchVouchers();
  }, []);
  useEffect(() => {
    console.log(vouchers);
  }, [vouchers]);

  const [selectedShippingVoucher, setSelectedShippingVoucher] =
    useState<Promotion | null>();
  const [selectedDiscountVoucher, setSelectedDiscountVoucher] =
    useState<Promotion | null>();

  // Xử lý khi chọn voucher freeship
  // const handleShippingVoucherSelect = (voucher: Promotion) => {
  //   setSelectedShippingVoucher(voucher);
  //   setIdShip(voucher.id);
  //   console.log(voucher.id);
  // };
  const handleShippingVoucherSelect = (voucher: Promotion) => {
    setSelectedShippingVoucher((prevSelected) =>
      prevSelected?.id === voucher.id ? null : voucher
    );
    setIdShip((prevId) => (prevId === voucher.id ? null : voucher.id));
  };

  // Xử lý khi chọn voucher giảm giá tiền (phần trăm hoặc tiền mặt)
  // const handleDiscountVoucherSelect = (voucher: Promotion) => {
  //   setSelectedDiscountVoucher((prevSelected) => {
  //     // Kiểm tra xem voucher đã có trong danh sách chưa
  //     const isSelected = prevSelected?.id === voucher.id;
  //     if (isSelected) {
  //       // Nếu có, loại bỏ nó
  //       return null;
  //     } else {
  //       // Nếu chưa, thêm nó vào danh sách
  //       return voucher;
  //     }
  //   });

  //   // cập nhật idVoucher
  //   setIdVoucher(voucher.id);
  // };
  const handleDiscountVoucherSelect = (voucher: Promotion) => {
    setSelectedDiscountVoucher((prevSelected) => {
      const isSelected = prevSelected?.id === voucher.id;
      if (isSelected) {
        // Nếu bỏ chọn voucher
        setTotalAmount(originalTotalAmount); // Khôi phục giá ban đầu
        return null;
      } else {
        // Nếu chọn voucher mới
        setTotalAmount(originalTotalAmount); // Đặt lại giá ban đầu trước khi áp dụng voucher mới
        return voucher;
      }
    });
    setIdVoucher(voucher.id);
  };

  // const submitVoucher = () => {
  //   if (selectedDiscountVoucher) {
  //     // Kiểm tra loại voucher giảm giá
  //     if (selectedDiscountVoucher.discount_type === "money") {
  //       setTotalAmount((prev) => prev - selectedDiscountVoucher.discount_value);
  //     } else if (selectedDiscountVoucher.discount_type === "percentage") {
  //       setTotalAmount(
  //         (prev) => prev - prev * (selectedDiscountVoucher.discount_value / 100)
  //       );
  //     }
  //     message.success("Đã áp dụng voucher thành công!");
  //   }
  //   handleCancelDiscount();
  //   return;
  // };

  const handlePaymentChange = (value: string) => {
    setPaymentMethod((prev) => (prev === value ? "" : value));
  };
  const submitVoucher = () => {
    if (selectedDiscountVoucher) {
      const discountValue = selectedDiscountVoucher.discount_value;
      const discountType = selectedDiscountVoucher.discount_type;
      const maxDiscount = selectedDiscountVoucher.max_discount || Infinity;

      if (discountType === "money") {
        // const discountAmount = Math.min(discountValue, maxDiscount);
        // const newTotal = originalTotalAmount - discountAmount;
        const newTotal = originalTotalAmount - discountValue;
        setTotalAmount(newTotal);
        // setTotalAmount(Math.max(0, newTotal));
        console.log("New Total Amount (Money):", newTotal);
      } else if (discountType === "percentage") {
        const calculatedDiscount = originalTotalAmount * (discountValue / 100);
        // const discountAmount = Math.min(calculatedDiscount, maxDiscount);
        // const newTotal = originalTotalAmount - discountAmount;
        const newTotal =
          originalTotalAmount - originalTotalAmount * (discountValue / 100);
        setTotalAmount(newTotal);
        // setTotalAmount(Math.max(0, newTotal));
        console.log("New Total Amount (Percentage):", newTotal);
      }

      message.success("Đã áp dụng voucher thành công!");
    }
    handleCancelDiscount();
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
                {/* <div
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
                </div> */}
              </div>
            </div>
          </div>

          <div
            className="col-lg-10 col-xl-7 m-lr-auto m-b-50"
            style={{ marginBottom: "20px" }}
          >
            <div className="bor10 p-lr-40 p-t-30 p-b-40 m-l-63 m-r-40 m-lr-0-xl p-lr-15-sm">
              <div className="flex-w flex-sb-m bor15 p-t-18 p-b-15 p-lr-40 p-lr-15-sm">
                {/* <div className="flex-w flex-m m-r-20 m-tb-5">
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
                </div> */}
                <div
                  className="label size-208 w-full-ssm mt-3"
                  style={{ marginLeft: "-40px" }}
                >
                  <span
                    className="text-lg text-gray-700 "
                    style={{ fontSize: "15px", fontWeight: "bold" }}
                  >
                    <i className="fa-solid fa-tag"></i> Voucher
                  </span>
                </div>

                <div className="flex-c-m stext-101 cl2 size-119 bg8 bor13 hov-btn3 p-lr-15 trans-04 pointer m-tb-10">
                  <div>
                    {/* Thêm nút để mở modal danh sách mã giảm giá */}
                    <button type="button" onClick={showDiscountModal}>
                      Chọn voucher
                    </button>

                    {/* Modal hiển thị danh sách mã giảm giá */}
                    <Modal
                      title="Mã giảm giá"
                      visible={isDiscountModalVisible}
                      onCancel={handleCancelDiscount}
                      footer={null}
                    >
                      <div className="voucher-container">
                        <div className="voucher-label">
                          <span>Mã Voucher</span>
                        </div>
                        <input
                          type="text"
                          placeholder="Tìm mã giảm giá..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="search-input"
                        />
                        <button className="apply-button">Áp dụng</button>
                      </div>

                      <div className="discount-list">
                        {/* Vouchers freeship */}
                        {/* {vouchers &&
                          vouchers.discount_shipping.map((voucher, index) => (
                            <div className="discount-item" key={index}>
                              <div className="discount-left">
                                <div className="discount-icon">
                                  <i
                                    className="fa-solid fa-truck-fast"
                                    style={{ color: "#0f8f18" }}
                                  ></i>
                                </div>
                              </div>
                              <div className="discount-right">
                                <div className="discount-info">
                                  <span className="discount-title">
                                    {voucher.discount_type}
                                  </span>
                                  <p className="discount-description">
                                    Giảm tối đa{" "}
                                    {voucher.discount_value
                                      ? voucher.discount_value + "₫"
                                      : "N/A"}
                                  </p>
                                  <div className="discount-status">
                                    <span>HSD: {voucher.end_date}</span>
                                  </div>
                                </div>
                                <div className="discount-checkbox">
                                  <input
                                    type="checkbox"
                                    checked={
                                      selectedShippingVoucher?.id === voucher.id
                                    }
                                    onChange={() =>
                                      handleShippingVoucherSelect(voucher)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          ))} */}

                        {/* Vouchers giảm giá tiền (phần trăm hoặc tiền mặt) */}
                        {vouchers &&
                          vouchers.discount_percentage.map((voucher, index) => (
                            <div className="discount-item" key={index}>
                              <div className="discount-left">
                                <div className="discount-icon">
                                  <i className="fa-solid fa-tag"></i>
                                </div>
                              </div>
                              <div className="discount-right">
                                <div className="discount-info">
                                  <span className="discount-title">
                                    {/* {voucher.discount_type} */}
                                    Mã giảm giá
                                  </span>
                                  <p className="discount-description">
                                    Giảm
                                    {voucher.discount_value
                                      ? Number(
                                          voucher.discount_value
                                        ).toLocaleString() + " %"
                                      : "N/A"}
                                  </p>
                                  <p>
                                    Giảm tối đa :{" "}
                                    {voucher.max_discount &&
                                    voucher.max_discount > 0
                                      ? Number(
                                          voucher.max_discount
                                        ).toLocaleString() + " đ"
                                      : "Không giới hạn"}
                                  </p>
                                  <p>
                                    Đơn tối thiểu :{" "}
                                    {voucher.min_purchase_amount
                                      ? Number(
                                          voucher.min_purchase_amount
                                        ).toLocaleString() + " đ"
                                      : "từ 0 đ"}
                                  </p>{" "}
                                  <div className="discount-status">
                                    <span>HSD: {voucher.end_date}</span>
                                  </div>
                                </div>
                                <div className="discount-checkbox">
                                  <input
                                    type="checkbox"
                                    checked={
                                      selectedDiscountVoucher === voucher
                                    }
                                    onChange={(event) => {
                                      const isChecked = event.target.checked;
                                      if (isChecked) {
                                        handleDiscountVoucherSelect(voucher);
                                      } else {
                                        // Nếu đã được chọn và bỏ chọn, xóa nó khỏi danh sách
                                        handleDiscountVoucherSelect(voucher);
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}

                        {vouchers &&
                          vouchers.discount_money.map((voucher, index) => (
                            <div className="discount-item" key={index}>
                              <div className="discount-left">
                                <div className="discount-icon">
                                  <i className="fa-solid fa-tag"></i>
                                </div>
                              </div>
                              <div className="discount-right">
                                <div className="discount-info">
                                  <span className="discount-title">
                                    {/* {voucher.discount_type} */}
                                    Mã giảm giá
                                  </span>
                                  <p className="discount-description">
                                    Giảm tối đa :{" "}
                                    {voucher.discount_value
                                      ? Number(
                                          voucher.discount_value
                                        ).toLocaleString() + "₫"
                                      : "N/A"}
                                  </p>
                                  <div className="discount-status">
                                    <span>HSD: {voucher.end_date}</span>
                                  </div>
                                </div>
                                <div className="discount-checkbox">
                                  <input
                                    type="checkbox"
                                    checked={
                                      selectedDiscountVoucher === voucher
                                    }
                                    onChange={(event) => {
                                      const isChecked = event.target.checked;
                                      if (isChecked) {
                                        handleDiscountVoucherSelect(voucher);
                                      } else {
                                        // Nếu đã được chọn và bỏ chọn, xóa nó khỏi danh sách
                                        handleDiscountVoucherSelect(voucher);
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>

                      <div className="modal-footer">
                        <button
                          className="back-button"
                          onClick={handleCancelDiscount}
                        >
                          Trở lại
                        </button>
                        <button
                          className="ok-button"
                          onClick={() => submitVoucher()}
                        >
                          OK
                        </button>
                      </div>
                    </Modal>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-10 col-xl-7 m-lr-auto m-b-50">
            <div className="bor10 p-lr-40 p-t-30 p-b-40 m-l-63 m-r-40 m-lr-0-xl p-lr-15-sm">
              <div className="flex-w flex-t bor12 p-t-15 p-b-30">
                <div
                  className="label size-208 w-full-ssm mt-3"
                  style={{
                    width: "80px",
                    // backgroundColor: "red",
                  }}
                >
                  <span
                    className="text-lg text-gray-700 "
                    style={{ fontSize: "15px", fontWeight: "bold" }}
                  >
                    <div
                      style={{
                        justifyContent: "center",
                        // backgroundColor: "yellow",
                      }}
                    >
                      <i className="fa-solid fa-location-dot"></i> Địa chỉ:
                    </div>
                  </span>
                </div>

                <div className="address-card">
                  <div style={{ display: "flex" }}>
                    <div
                      className="address-content"
                      style={{
                        marginLeft: "68%",
                        // backgroundColor: "red",
                        width: "300px",
                      }}
                    >
                      {/* Tên và số điện thoại hiển thị cùng một dòng */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          flexWrap: "nowrap",
                          overflow: "hidden",
                        }}
                      >
                        <span
                          className="address-name"
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap", // Giữ nội dung trên 1 dòng
                          }}
                        >
                          {defaultAddress?.recipient_name}
                        </span>
                        <span style={{ margin: "0 10px" }}>|</span>
                        <span
                          className="address-phone"
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {defaultAddress?.phone}
                        </span>
                      </div>

                      <hr />

                      {/* Địa chỉ hiển thị riêng một dòng */}
                    </div>

                    {/* Nút thay đổi */}
                    <Button
                      style={{
                        marginLeft: "80%",
                        width: "90px",
                        display: "block",
                      }}
                    >
                      <a className="change-link" onClick={showModal}>
                        Địa chỉ
                      </a>
                    </Button>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      flexWrap: "nowrap",
                      overflow: "hidden",
                      // backgroundColor: "blue",
                      marginLeft: "63%",
                      width: "400px",
                    }}
                  >
                    <span
                      className="address-details"
                      style={{ color: "#666", flexWrap: "nowrap" }}
                    >
                      {defaultAddress?.address_line} - {defaultAddress?.state} -{" "}
                      {defaultAddress?.city}
                    </span>
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
                              // marginLeft: "30px",
                            }}
                          >
                            <input
                              type="radio"
                              name="address"
                              checked={address.is_default === 1}
                              className="address-checkbox"
                              style={{ marginRight: "15px" }}
                              // onChange={() => setAddressId(address.id)}
                              onChange={() => checkPrime(address.id)}
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
                            {/* <Button
                              className="update address"
                              style={{
                                display: "flex",
                                marginLeft: "90px",
                                color: "#666",
                              }}
                            >
                              Sửa
                            </Button> */}
                          </div>
                        ))}
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

                      <div
                        style={{
                          display: "flex", // Sử dụng Flexbox
                          justifyContent: "center", // Căn giữa theo chiều ngang
                          alignItems: "center", // Căn giữa theo chiều dọc
                        }}
                      >
                        {/* <Button onClick={handleUpdateAddress}>Cập Nhật</Button> */}
                      </div>
                    </div>
                  </Modal>
                </div>
              </div>
              <div
                className="flex-w flex-t bor12 p-t-15 p-b-30"
                style={{ marginTop: "30px" }}
              >
                <div className="label size-208 w-full-ssm mt-3">
                  <span
                    className="text-lg text-gray-700 "
                    style={{ fontSize: "15px", fontWeight: "bold" }}
                  >
                    <i className="fa-regular fa-credit-card"></i> Phương thức
                    thanh toán
                  </span>
                </div>
                {/* <div className="address-inputs size-209 p-x-18 p-x-0-sm w-full-ssm ">
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
                </div> */}

                <div className="address-inputs size-209 p-x-18 p-x-0-sm w-full-ssm">
                  <div className="p-y-15">
                    <div className="select-country bg-white mb-3 mt-2">
                      <div className="checkbox-container">
                        <label>
                          <input
                            type="checkbox"
                            checked={paymentMethod === "cod"}
                            onChange={() => setPaymentMethod("cod")}
                          />
                          <img
                            src="/images/cod.png"
                            alt="COD Logo"
                            className="payment-logo"
                          />{" "}
                          Thanh toán khi nhận hàng
                        </label>
                      </div>
                      <div className="checkbox-container">
                        <label>
                          <input
                            type="checkbox"
                            checked={paymentMethod === "vnpay"}
                            onChange={() => setPaymentMethod("vnpay")}
                          />
                          <img
                            src="/images/vnpay.jpg"
                            alt="VNPAY Logo"
                            className="payment-logo"
                          />{" "}
                          Thanh toán bằng VN Pay
                        </label>
                      </div>
                      <div className="checkbox-container">
                        <label>
                          <input
                            type="checkbox"
                            checked={paymentMethod === "momo"}
                            onChange={() => setPaymentMethod("momo")}
                          />
                          <img
                            src="/images/momo.webp"
                            alt="Momo Logo"
                            className="payment-logo"
                          />{" "}
                          Thanh toán bằng Momo
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-w flex-t p-t-27 p-b-33">
                <div className="size-208">
                  <span
                    className="text-lg text-gray-700 "
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
                    {totalAmount !== undefined
                      ? totalAmount.toLocaleString() + "₫"
                      : "N/A"}
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

export default PaymentPage2;
