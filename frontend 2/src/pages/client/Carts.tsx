import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

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
    price: number;
    is_active: number;
  };
}

const Carts: React.FC = () => {
  const [carts, setCarts] = useState<Cart[]>([]);
  const token = localStorage.getItem("access_token");

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
        console.log(result.data.cart_details);
        if (result && result.status && result.data) {
          // Kiểm tra xem API có trả về mảng sản phẩm không
          if (
            result.data.cart_details &&
            Array.isArray(result.data.cart_details)
          ) {
            setCarts(result.data.cart_details); // Set giỏ hàng với danh sách sản phẩm
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
  return (
    // <Layout q={10}>
    <form className="bg0 p-t-75 p-b-85">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-xl-10 m-lr-auto m-b-50">
            <div className="m-l-25 m-r-0 m-lr-0-xl">
              <div className="wrap-table-shopping-cart">
                <table className="table-shopping-cart w-full">
                  <thead>
                    <tr className="table_head">
                      <th className="column-1 text-xl">Chọn</th>{" "}
                      {/* Cột mới cho checkbox */}
                      <th className="column-2 text-xl">Sản phẩm</th>
                      <th className="column-3 text-xl">Giá</th>
                      <th className="column-4 text-xl">Số lượng</th>
                      <th className="column-5 text-xl">Tổng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carts.map((cart) => (
                      <tr key={cart.id} className="table_row">
                        <td className="column-1 p-4">
                          <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-blue-500"
                          />
                        </td>
                        <td className="column-2 text-lg">
                          {cart.product.name}
                        </td>
                        <td className="column-3 text-lg">
                          {cart.product.price}
                        </td>
                        <td className="column-4">
                          <div className="wrap-num-product flex-w m-l-auto m-r-0">
                            <div className="btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m">
                              <i className="fs-16 zmdi zmdi-minus"></i>
                            </div>
                            <input
                              className="mtext-104 cl3 txt-center num-product p-2 text-lg"
                              type="number"
                              name="num-product1"
                              defaultValue={cart.quantity}
                            />
                            <div className="btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m">
                              <i className="fs-16 zmdi zmdi-plus"></i>
                            </div>
                          </div>
                        </td>
                        <td className="column-5 text-lg">
                          {cart.product.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Link to="/payments">
                <button className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer mt-[3px] text-xl py-4 px-8 w-full md:w-auto">
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
