import React from "react";
import Layout from "../../components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

type Props = {};

const Carts = (props: Props) => {
  return (
    <Layout>
      <form className="bg0 p-t-75 p-b-85">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 col-xl-7 m-lr-auto m-b-50">
              <div className="m-l-25 m-r--38 m-lr-0-xl">
                <div className="wrap-table-shopping-cart">
                  <table className="table-shopping-cart">
                    <thead>
                      <tr className="table_head">
                        <th className="column-1">Sản phẩm</th>
                        <th className="column-2"></th>
                        <th className="column-3">Giá</th>
                        <th className="column-4">Số lượng</th>
                        <th className="column-5">Tổng</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="table_row">
                        <td className="column-1">
                          <div className="how-itemcart1">
                            {/* <div
                              className="flex items-center"
                              style={{ marginTop: "30px" }}
                            >
                              <input
                                type="checkbox"
                                id="product-checkbox"
                                className="form-checkbox h-5 w-5 text-green-500"
                                aria-label="Select product"
                              />
                            </div> */}
                            <img src="images/item-cart-04.jpg" alt="IMG" />
                          </div>
                        </td>

                        <td className="column-2">Fresh Strawberries</td>
                        <td className="column-3">$ 36.00</td>
                        <td className="column-4">
                          <div className="wrap-num-product flex-w m-l-auto m-r-0">
                            <div className="btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m">
                              <i className="fs-16 zmdi zmdi-minus"></i>
                            </div>

                            <input
                              className="mtext-104 cl3 txt-center num-product"
                              type="number"
                              name="num-product1"
                              defaultValue="1"
                            />

                            <div className="btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m">
                              <i className="fs-16 zmdi zmdi-plus"></i>
                            </div>
                          </div>
                        </td>
                        <td className="column-5">$ 36.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex-w flex-sb-m bor15 p-t-18 p-b-15 p-lr-40 p-lr-15-sm">
                  <div className="flex-w flex-m m-r-20 m-tb-5">
                    <input
                      className="stext-104 cl2 plh4 size-117 bor13 p-lr-20 m-r-10 m-tb-5"
                      type="text"
                      name="coupon"
                      placeholder="Coupon Code"
                    />

                    <div className="flex-c-m stext-101 cl2 size-118 bg8 bor13 hov-btn3 p-lr-15 trans-04 pointer m-tb-5">
                      Nhập mã giảm giá
                    </div>
                  </div>

                  <div className="flex-c-m stext-101 cl2 size-119 bg8 bor13 hov-btn3 p-lr-15 trans-04 pointer m-tb-10">
                    Cập nhật giỏ hàng
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-10 col-lg-7 col-xl-5 m-lr-auto m-b-50">
              <div className="bor10 p-lr-40 p-t-30 p-b-40 m-l-63 m-r-40 m-lr-0-xl p-lr-15-sm">
                <h4 className="mtext-109 cl2 p-b-30">Tổng giỏ hàng</h4>

                <div className="flex-w flex-t bor12 p-b-13">
                  <div className="size-208">
                    <span className="stext-110 cl2">Tổng tiền:</span>
                  </div>

                  <div className="size-209">
                    <span className="mtext-110 cl2">$79.65</span>
                  </div>
                </div>

                <div className="flex-w flex-t bor12 p-t-15 p-b-30">
                  <div className="label size-208 w-full-ssm mt-3">
                    <span className="text-lg text-gray-700 ">Địa chỉ:</span>
                  </div>

                  <div className="address-inputs size-209 p-x-18 p-x-0-sm w-full-ssm ">
                    <div className="p-y-15">
                      <div className="select-country bg-white mb-3 mt-2">
                        <select className="w-full p-2" name="country">
                          <option>Chọn địa chỉ giao hàng...</option>
                          <option>USA</option>
                          <option>UK</option>
                          <option>Thêm địa chỉ mới</option>
                        </select>
                      </div>

                      {/* <div className="flex justify-center">
                        <button className="update-button text-base text-gray-700 bg-light-gray border rounded-lg hover:bg-gray-300 p-2 cursor-pointer transition">
                          Update Totals
                        </button>
                      </div> */}
                    </div>
                  </div>
                </div>

                <div className="flex-w flex-t p-t-27 p-b-33">
                  <div className="size-208">
                    <span className="mtext-101 cl2">Tổng tiền:</span>
                  </div>

                  <div className="size-209 p-t-1">
                    <span className="mtext-110 cl2">$79.65</span>
                  </div>
                </div>

                <button className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer">
                  Tiến hành thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default Carts;
