import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setQuantityCart } from "../../store/quantityCartSlice";
import { setCartDetailIds } from "../../store/cartDetailSlice";
import { RootState } from "../../store/store";
import {
  Button,
  Checkbox,
  CheckboxProps,
  message,
  Popconfirm,
  PopconfirmProps,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";

type Props = {};
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
    is_active: number;
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

const Carts: React.FC = () => {
  const dispatch = useDispatch();
  const [ids, setIds] = useState<number[]>([]);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [carts, setCarts] = useState<Cart[]>([]);
  const token = localStorage.getItem("access_token");

  const onChange = (e: any, id: number) => {
    console.log(`checked = ${e.target.checked}, id = ${id}`);
    if (e.target.checked) {
      setIds((prevIds) => [...prevIds, id]);
    } else {
      setIds((prevIds) => prevIds.filter((item) => item !== id));
    }
    console.log(ids);
  };
  useEffect(() => {
    dispatch(setCartDetailIds(ids));
    localStorage.setItem("cartDetailOrder", JSON.stringify(ids));
  }, [ids]);

  const handleCheckAll = (e: any) => {
    setIsCheckAll(e.target.checked);
    if (e.target.checked) {
      // Chọn tất cả id
      const allIds = carts.map((cart) => cart.id);
      setIds(allIds);
    } else {
      // Bỏ chọn tất cả
      setIds([]);
    }
  };

  const confirm: PopconfirmProps["onConfirm"] = (e) => {
    console.log(e);
    message.success("Xóa sản phẩm thành công!");
  };

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/cart`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result && result.status && result.data) {
          if (
            result.data.cart_details &&
            Array.isArray(result.data.cart_details)
          ) {
            setCarts(result.data.cart_details.reverse()); // Set giỏ hàng với danh sách sản phẩm
          } else {
            console.error("Giỏ hàng không chứa mảng sản phẩm:", result);
          }
        } else {
          console.error("Invalid data format:", result);
        }
      } catch (error) {
        console.error("Error fetching carts:", error);
      }
    };

    fetchCarts();
  }, []);
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/cart-detail/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        dispatch(setQuantityCart(carts.length));

        message.success("Sản phẩm đã được xóa thành công!");
        setCarts(carts.filter((cart) => cart.id !== id));
      } else {
        message.error("Đã có lỗi xảy ra khi xóa sản phẩm.");
      }
    } catch (error) {
      message.error("Đã có lỗi xảy ra khi xóa sản phẩm.");
    }
  };

  const handleDeleteAll = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/carts-detail/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids }), // Đưa body ra ngoài headers
      });

      if (response.ok) {
        message.success("Sản phẩm đã được xóa thành công!");
        setIds([]);
        setCarts(carts.filter((cart) => !ids.includes(cart.id)));
        dispatch(setQuantityCart(carts.length));
      } else {
        message.error("Đã có lỗi xảy ra khi xóa sản phẩm.");
      }
    } catch (error) {
      message.error("Đã có lỗi xảy ra khi xóa sản phẩm.");
    }
  };

  const updateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/cart-detail/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      if (response.ok) {
        message.success("Số lượng đã được cập nhật!");
        setCarts(
          carts.map((cart) =>
            cart.id === id ? { ...cart, quantity: newQuantity } : cart
          )
        );
      } else {
        message.error("Đã có lỗi xảy ra khi cập nhật số lượng.");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };
  return (
    // <Layout q={10}>
    <form className="bg0 p-t-75 p-b-85">
      <div className="container">
        <h6
          className="ltext-105 cl5 txt-center respon1"
          style={{ marginBottom: "40px", marginTop: "-40px" }}
        >
          Giỏ Hàng
        </h6>
        <div className="row">
          <div className="col-lg-12 col-xl-10 m-lr-auto m-b-50">
            <div className="m-l-25 m-r-0 m-lr-0-xl">
              <div className="wrap-table-shopping-cart">
                <table className="table-shopping-cart w-full">
                  {/* Checkbox để check all */}

                  <thead>
                    <tr className="table_head ">
                      <th
                        className="column-1 text-xl"
                        // style={{ display: "flex" }}
                      >
                        <Checkbox
                          checked={isCheckAll}
                          onChange={handleCheckAll}
                        ></Checkbox>
                        <Popconfirm
                          style={{ marginRight: "5px" }}
                          title="Xóa sản phẩm"
                          description="Bạn có chắc muốn xóa sản phẩm không?"
                          onConfirm={() => handleDeleteAll()}
                          okText="Có"
                          cancelText="Không"
                        >
                          <Button danger>
                            <DeleteOutlined />
                          </Button>
                        </Popconfirm>
                      </th>{" "}
                      {/* Cột mới cho checkbox */}
                      <th className="column-2 text-xl ">Sản phẩm</th>
                      <th className="column text-xl "></th>
                      <th className="column-3 text-xl">Giá</th>
                      <th className="column-4 text-xl">Số lượng</th>
                      <th className="column-5 text-xl">Tổng</th>
                      <th className="column-6 text-xl ">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center">
                          <p
                            style={{ marginBottom: "40px", marginTop: "40px" }}
                          >
                            Không có sản phẩm nào trong giỏ hàng
                          </p>
                        </td>
                      </tr>
                    ) : (
                      carts.map((cart) => (
                        <tr
                          key={cart.id}
                          className={`table_row ${
                            cart.product_variant.is_active === 0 ||
                            cart.product_variant.stock === 0
                              ? "opacity-50"
                              : ""
                          }`}
                          style={{
                            opacity:
                              cart.product_variant.is_active === 0 ||
                              cart.product_variant.stock === 0
                                ? 0.5
                                : 1,
                          }}
                        >
                          <td
                            className="column-1 p-4"
                            style={{
                              opacity:
                                cart.product_variant.is_active === 0 ||
                                cart.product_variant.stock === 0
                                  ? 0.5
                                  : 1,
                            }}
                          >
                            {!cart.product_variant.is_active ||
                            cart.product_variant.stock === 0 ? null : (
                              <Checkbox
                                checked={ids.includes(cart.id)}
                                onChange={(e) => onChange(e, cart.id)}
                              />
                            )}
                          </td>
                          <td className="column-2 text-lg flex items-center space-x-4">
                            {/* Hiển thị ảnh sản phẩm */}
                            <Link
                              to={`/products/${cart.product.id}`}
                              className={`stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6 ${
                                cart.product_variant.is_active === 0
                                  ? "opacity-50"
                                  : ""
                              }`}
                            >
                              <img
                                src={`http://127.0.0.1:8000/storage/${
                                  cart?.product.image?.image_url ||
                                  "default-image.jpg"
                                }`}
                                alt="IMG-PRODUCT"
                                width="100"
                                height="150"
                                style={{
                                  objectFit: "cover",
                                  borderRadius: "4px",
                                  opacity:
                                    cart.product_variant.is_active === 0
                                      ? 0.5
                                      : 1,
                                }}
                              />
                            </Link>
                          </td>
                          <td className="column text-lg">
                            <Link
                              to={`/products/${cart.product.id}`}
                              className={`stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6 ${
                                cart.product_variant.is_active === 0
                                  ? "opacity-50"
                                  : ""
                              }`}
                            >
                              {cart.product.name}
                            </Link>
                            {cart.product_variant && (
                              <p className="text-gray-500 text-sm">
                                Kích thước:{" "}
                                {cart.product_variant.size.size_name}, Màu sắc:{" "}
                                {cart.product_variant.color.color_name}
                              </p>
                            )}
                          </td>
                          <td className="column-3 text-lg">
                            {cart.product_variant.price
                              ? Number(
                                  cart.product_variant.price
                                ).toLocaleString() + "₫"
                              : "Không xác định"}
                          </td>
                          <td className="column-4">
                            <div className="wrap-num-product flex-w m-l-auto m-r-0">
                              <button
                                className={`btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m ${
                                  cart.product_variant.is_active === 0 ||
                                  cart.product_variant.stock === 0
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  cart.quantity > 1 &&
                                    updateQuantity(cart.id, cart.quantity - 1);
                                }}
                                disabled={
                                  cart.product_variant.is_active === 0 ||
                                  cart.product_variant.stock === 0 ||
                                  cart.quantity <= 1
                                }
                              >
                                <i className="fs-16 zmdi zmdi-minus"></i>
                              </button>

                              <input
                                className="mtext-104 cl3 txt-center num-product p-2 text-lg"
                                type="number"
                                name="num-product1"
                                value={cart.quantity}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  if (
                                    value >= 1 &&
                                    value <= cart.product.stock
                                  ) {
                                    updateQuantity(cart.id, value);
                                  }
                                }}
                              />
                              <button
                                className={`btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m ${
                                  cart.product_variant.is_active === 0 ||
                                  cart.product_variant.stock === 0
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  cart.quantity < cart.product_variant.stock &&
                                    updateQuantity(cart.id, cart.quantity + 1);
                                }}
                              >
                                <i className="fs-16 zmdi zmdi-plus"></i>
                              </button>
                            </div>
                          </td>
                          <td className="column-5 text-lg">
                            {(
                              cart.product_variant.price * cart.quantity
                            ).toLocaleString()}
                            ₫
                          </td>
                          <td className="column-6 text-lg">
                            <Popconfirm
                              title="Xóa sản phẩm"
                              description="Bạn có chắc muốn xóa sản phẩm này không?"
                              onConfirm={() => handleDelete(cart.id)}
                              okText="Có"
                              cancelText="Không"
                            >
                              <Button danger>
                                <DeleteOutlined />
                              </Button>
                            </Popconfirm>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <Link to={ids.length > 0 ? "/payments" : "#"}>
                <button
                  className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer mt-[3px] text-xl py-4 px-8 w-full md:w-auto"
                  disabled={ids.length === 0} // Disable nút nếu không có sản phẩm được chọn
                  style={{
                    backgroundColor: ids.length > 0 ? "#333" : "#ccc", // Thay đổi màu khi nút bị disable
                    cursor: ids.length > 0 ? "pointer" : "not-allowed", // Thay đổi con trỏ
                  }}
                >
                  Tiến hành thanh toán
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </form>

    // </Layout>
  );
};

export default Carts;
