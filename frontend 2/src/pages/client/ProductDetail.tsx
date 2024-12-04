import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { setQuantityCart } from "../../store/quantityCartSlice";
import { Rate } from "antd";
import Heart from "../../components/Heart";

interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  price_max: number;
  price_min: number;
  image_url: string;
  color: {
    id: number;
    name: string;
  }[];
  size: {
    id: number;
    name: string;
  }[];
  product_variants: {
    size_id: number;
    color_id: number;
    price: number;
    stock: number;
    image_url: string;
  };
}
interface Review {
  id: number;
  user_id: number;
  user: {
    username: string;
  };
  product_id: number;
  comment: string;
  rating: number;
  review_date: Date;
}
interface Size {
  id: number;
  name: string;
}
interface Color {
  id: number;
  name: string;
}
interface rating {
  average_rating: number;
  rating_count: number;
}

interface Error {
  errorSize?: string;
  errorColor?: string;
}

interface Data {
  id: number;
  sizeId: number;
  colorId: number;
  quantity: number;
}
interface ProductDetailProps {
  addToCart: (
    id: number | string | undefined,
    sizeId: number | string | undefined,
    colorId: number | string | undefined,
    quantity: number | string
  ) => void;
}
const ProductDetail: React.FC<ProductDetailProps> = ({ addToCart }) => {
  const dispatch = useDispatch();

  const [error, setError] = useState<Error>({});
  const { id } = useParams();
  const [sizes, setSize] = useState<Size[]>([]);

  const [sizeId, setSizeId] = useState<number>();
  const [colorId, setColorId] = useState<number>();

  const [colors, setColor] = useState<Color[]>([]);
  const [products, setProducts] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<{
    average_rating: number;
    rating_count: number;
  }>({
    average_rating: 0,
    rating_count: 0,
  });

  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  // call api products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/products/${id}`
        );

        // Kiểm tra nếu phản hồi từ server là thành công
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Kiểm tra xem result có dữ liệu hợp lệ không
        if (result && result.data) {
          setProducts(result.data);
          setSize(result.data.size);
          setColor(result.data.color);
        } else {
          console.error("Data is not valid:", result);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [id]);
  // call api review
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/get-reviews-by-product/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Kiểm tra nếu phản hồi từ server là thành công
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Kiểm tra xem result có dữ liệu hợp lệ không
        if (result && result.data) {
          setReviews(result.data);
          console.log(result);
          setRating({
            average_rating: result.average_rating,
            rating_count: result.rating_count,
          });
        } else {
          console.error("Data is not valid:", result);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchReviews();
  }, [id]);

  // call api sizes
  // useEffect(() => {
  //   const fetchSizes = async () => {
  //     try {
  //       const response = await fetch(`http://127.0.0.1:8000/api/sizes`);

  //       // Kiểm tra nếu phản hồi từ server là thành công
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }

  //       const result = await response.json();

  //       // Kiểm tra xem result có dữ liệu hợp lệ không
  //       if (result && result.data) {
  //         setSize(result.data);
  //       } else {
  //         console.error("Data is not valid for sizes:", result);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching sizes:", error);
  //     }
  //   };

  //   fetchSizes();
  // }, []); // Chạy chỉ một lần khi component được mount

  // call api colors
  // useEffect(() => {
  //   const fetchColors = async () => {
  //     try {
  //       const response = await fetch(`http://127.0.0.1:8000/api/colors`);

  //       // Kiểm tra nếu phản hồi từ server là thành công
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }

  //       const result = await response.json();

  //       // Kiểm tra xem result có dữ liệu hợp lệ không
  //       if (result && result.data) {
  //         setColor(result.data);
  //       } else {
  //         console.error("Data is not valid for colors:", result);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching colors:", error);
  //     }
  //   };

  //   fetchColors();
  // }, []); // Chạy chỉ một lần khi component được mount

  const handle = async () => {
    const errorObject = {
      errorSize: "",
      errorColor: "",
    };
    if (!sizeId) {
      errorObject.errorSize = "Vui lòng chọn kích thước!";
    }

    if (!colorId) {
      errorObject.errorColor = "Vui lòng chọn màu sắc!";
    }

    // Cập nhật lỗi cùng một lúc
    setError(errorObject);

    if (sizeId && colorId) {
      setError({
        errorSize: "",
        errorColor: "",
      });

      await addToCart(Number(id), sizeId, colorId, quantity);
    }
  };

  return (
    <div className="container">
      {/* bread-crumb */}
      <div className="bread-crumb flex-w p-l-25 p-r-15 p-t-30 p-lr-0-lg">
        <a href="/" className="stext-109 cl8 hov-cl1 trans-04">
          Trang chủ
          <i className="fa fa-angle-right m-l-9 m-r-10" aria-hidden="true"></i>
        </a>

        <a href="/products" className="stext-109 cl8 hov-cl1 trans-04">
          Sản phẩm
          <i className="fa fa-angle-right m-l-9 m-r-10" aria-hidden="true"></i>
        </a>

        <span className="stext-109 cl4">{products?.name}</span>
      </div>

      <section className="sec-product-detail bg0 p-t-65 p-b-60">
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-lg-7 p-b-30">
              <div className="p-l-25 p-r-30 p-lr-0-lg">
                <div className="wrap-slick3 flex-sb flex-w">
                  {/* <div className="wrap-slick3-arrows flex-sb-m flex-w">
                      ảnh
                    </div> */}

                  <div className="slick3 gallery-lb">
                    <div
                      className="item-slick3"
                      data-thumb="images/product-detail-01.jpg"
                    >
                      <div
                        className="wrap-pic-w pos-relative"
                        style={{ display: "flex" }}
                      >
                        <div className="slick3 gallery-lb">
                          <div
                            className="item-slick3"
                            data-thumb="images/product-detail-01.jpg"
                          >
                            <div className="wrap-pic-w pos-relative">
                              <img
                                src={`http://127.0.0.1:8000/storage/${
                                  products?.product_variants?.image_url ||
                                  "default-image.jpg"
                                }`}
                              />
                            </div>
                          </div>

                          <div
                            className="item-slick3"
                            data-thumb="images/product-detail-02.jpg"
                          >
                            <div className="wrap-pic-w pos-relative">
                              <img
                                src={`http://127.0.0.1:8000/storage/${
                                  products?.product_variants?.image_url ||
                                  "default-image.jpg"
                                }`}
                              />
                            </div>
                          </div>

                          <div
                            className="item-slick3"
                            data-thumb="images/product-detail-03.jpg"
                          >
                            <div className="wrap-pic-w pos-relative">
                              <img
                                src={`http://127.0.0.1:8000/storage/${
                                  products?.product_variants?.image_url ||
                                  "default-image.jpg"
                                }`}
                              />
                            </div>
                          </div>
                        </div>
                        <img
                          src={`http://127.0.0.1:8000/storage/${
                            products?.image_url || "default-image.jpg"
                          }`}
                          alt="IMG-PRODUCT"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {products && (
              <div className="col-md-6 col-lg-5 p-b-30 ">
                <div className="p-r-50 p-t-5 p-lr-0-lg">
                  <h4
                    className="mtext-105 cl2 js-name-detail p-b-14"
                    style={{
                      fontFamily: "Roboto, sans-serif",
                      fontSize: "30px",
                      color: "#2c3e50",
                      marginBottom: "14px",
                      fontWeight: "700",
                    }}
                  >
                    <strong>{products.name}</strong>
                  </h4>

                  <span className=" stext-102 p-t-20 sku-adjust ">
                    Mã :{products.sku}
                  </span>
                  <br />
                  <span className="mtext-108 cl2 p-t-20 ">
                    Giá: {products.price_min.toLocaleString()}₫ -{" "}
                    {products.price_max.toLocaleString()}₫
                  </span>

                  <div className="p-t-33">
                    <div className="product-options">
                      <div className="color-selector">
                        <span>Màu Sắc: </span>
                        {colors.map((color, index) => (
                          <button
                            key={index}
                            className={`color-button ${
                              selectedColor === color.name ? "selected" : ""
                            }`}
                            onClick={() => setSelectedColor(color.name)}
                          >
                            {color.name}
                          </button>
                        ))}
                      </div>

                      <div className="color-selector">
                        <span>Kích Thước: </span>
                        {sizes.map((size, index) => (
                          <button
                            key={index}
                            className={`size-button ${
                              selectedSize === size.name ? "selected" : ""
                            }`}
                            onClick={() => setSelectedSize(size.name)}
                          >
                            {size.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Chọn Số Lượng */}
                    <div className="flex-w flex-r-m p-b-10">
                      <div className="size-204 flex-w flex-m respon6-next">
                        <div
                          className="size-204 flex-w flex-m respon6-next"
                          style={{ marginLeft: "10px" }}
                        >
                          <div className="color-selector">
                            <span>Số Lượng: </span>
                          </div>
                          <div className="wrap-num-product flex-w m-r-20 m-tb-10">
                            <div
                              className="btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m"
                              onClick={() =>
                                setQuantity((prevQuantity) =>
                                  Math.max(prevQuantity - 1, 1)
                                )
                              }
                            >
                              <i className="fs-16 zmdi zmdi-minus"></i>
                            </div>

                            <input
                              className="mtext-104 cl3 txt-center num-product"
                              type="number"
                              name="num-product"
                              min="1"
                              max={
                                products.product_variants.stock
                                  ? products.product_variants.stock
                                  : 1
                              }
                              value={quantity}
                              onChange={handle}
                            />

                            <div
                              className="btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m"
                              onClick={() =>
                                setQuantity((preQuantity) =>
                                  Math.min(
                                    preQuantity + 1,
                                    products.product_variants.stock
                                  )
                                )
                              }
                            >
                              <i className="fs-16 zmdi zmdi-plus"></i>
                            </div>
                          </div>

                          <div
                            className="button-container"
                            style={{ display: "flex", gap: "10px" }}
                          >
                            <button
                              onClick={handle}
                              className="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04 js-addcart-detail"
                            >
                              Thêm vào giỏ
                            </button>
                            <button className="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04 js-addcart-detail">
                              Mua ngay
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-w flex-m p-l-100 p-t-40 respon7">
                    <div className="flex-m bor9 p-r-10 m-r-11">
                      <Heart product_id={products.id} />
                    </div>

                    <a
                      href="https://www.facebook.com/profile.php?id=61569659241755"
                      className="fs-14 cl3 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 m-r-8 tooltip100"
                      data-tooltip="Facebook"
                    >
                      <i className="fa fa-facebook"></i>
                    </a>

                    <a
                      href="#"
                      className="fs-14 cl3 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 m-r-8 tooltip100"
                      data-tooltip="Twitter"
                    >
                      <i className="fa fa-twitter"></i>
                    </a>

                    <a
                      href="#"
                      className="fs-14 cl3 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 m-r-8 tooltip100"
                      data-tooltip="Google Plus"
                    >
                      <i className="fa fa-google-plus"></i>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bor10 m-t-50 p-t-43 p-b-40">
            <div className="tab01">
              <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item p-b-10">
                  <a
                    className="nav-link active"
                    data-toggle="tab"
                    href="#description"
                    role="tab"
                  >
                    Mô tả
                  </a>
                </li>

                <li className="nav-item p-b-10">
                  <a
                    className="nav-link"
                    data-toggle="tab"
                    href="#reviews"
                    role="tab"
                  >
                    Đánh giá
                  </a>
                </li>
              </ul>

              <div className="tab-content p-t-43">
                <div
                  className="tab-pane fade show active"
                  id="description"
                  role="tabpanel"
                >
                  <div className="how-pos2 p-lr-15-md">
                    <p className="stext-102 cl6">{products?.description}</p>
                  </div>
                </div>

                <div
                  className="tab-pane fade"
                  id="information"
                  role="tabpanel"
                ></div>

                <div className="tab-pane fade" id="reviews" role="tabpanel">
                  <div style={{ padding: "5px" }}>
                    {/* Hiển thị trung bình sao */}
                    <strong>
                      <strong>{rating.average_rating} trên 5</strong>
                    </strong>
                    <div style={{ display: "flex" }}>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <span
                          key={index}
                          style={{
                            color:
                              index < Math.round(rating.average_rating)
                                ? "orange"
                                : "lightgray", // Vàng cho các sao đã đạt, xám cho sao chưa đạt
                          }}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                    <br />

                    {/* Hiển thị số lượng đánh giá */}
                    <span>{rating.rating_count} Bình luận</span>
                  </div>

                  {reviews?.map((review, index) => (
                    <div
                      key={index}
                      className="rowww"
                      // style={{ height: "200px" }}
                    >
                      <div
                        className="comments"
                        style={{ marginRight: "600px" }}
                      >
                        <div
                          className="avatar"
                          style={{
                            width: "50px",
                            height: "50px",
                            display: "flex",
                          }}
                        >
                          <img
                            src="https://t.vietgiaitri.com/2018/12/6/tho-snowball-tro-lai-cuc-dang-yeu-trong-trailer-nhan-vat-moi-cua-249.jpg"
                            alt="avt"
                          />
                          <div
                            className="review"
                            style={{ marginLeft: "15px" }}
                          >
                            <div
                              className="username"
                              style={{ display: "inline-block", gap: "10px" }}
                            >
                              <span
                                className="mtext-106 cl2"
                                style={{ marginRight: "5px" }}
                              >
                                {review.user.username}
                              </span>

                              {review.review_date
                                ? new Date(
                                    review.review_date
                                  ).toLocaleDateString()
                                : "Invalid Date"}
                            </div>

                            <div className="star">
                              <div className="wrap-rating flex-m p-t-6">
                                <div>
                                  {Array.from({ length: review.rating }).map(
                                    (_, index) => (
                                      <span
                                        key={index}
                                        style={{ color: "gold" }}
                                      >
                                        ⭐
                                      </span>
                                    )
                                  )}
                                </div>
                              </div>
                              <p
                                className="comment"
                                style={{
                                  marginTop: "10px",
                                  whiteSpace: "pre-wrap", // Giúp văn bản tự động xuống dòng nếu dài
                                  overflowWrap: "break-word", // Giúp văn bản dài không bị tràn
                                }}
                              >
                                {review.comment}
                                <img
                                  style={{ width: "50px", height: "50px" }}
                                  src="https://t.vietgiaitri.com/2018/12/6/tho-snowball-tro-lai-cuc-dang-yeu-trong-trailer-nhan-vat-moi-cua-249.jpg"
                                  alt=""
                                />
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr
                        style={{
                          margin: "20px 0",
                          borderColor: "#ccc",
                          borderWidth: "1px",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="sec-relate-product bg0 p-t-45 p-b-105">
        <div className="container">
          <div className="p-b-45">
            <h3 className="ltext-106 cl5 txt-center">Related Products</h3>
          </div>
          <div className="tab-content p-t-50">
            <div
              className="tab-pane fade show active"
              id="best-seller"
              role="tabpanel"
            >
              <div className="wrap-slick2">
                <div className="slick2">
                  {/* Sản phẩm - 4 sản phẩm xếp ngang nhau */}
                  <div className="flex-w flex-sb-m p-l-15 p-r-15"></div>
                  {/* Thêm các sản phẩm khác nếu cần */}
                </div>
              </div>
            </div>
            {/* Các tab khác */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
