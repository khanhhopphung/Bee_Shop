// src/pages/Home.tsx
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Link } from "react-router-dom";
import Heart from "../../components/Heart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
type Blog = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image: { image_url: string };
};
const Home: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/products");

        // Kiểm tra nếu phản hồi từ server là thành công
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Kiểm tra nếu có dữ liệu và lấy 4 sản phẩm mới nhất
        if (result && result.data && Array.isArray(result.data)) {
          setProducts(result.data.slice(0, 4)); // Lấy 4 sản phẩm đầu tiên
        } else {
          console.error("Invalid data format:", result);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []); // Chạy chỉ một lần khi component được mount
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/blogs`);

        // Kiểm tra nếu phản hồi từ server là thành công
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Kiểm tra nếu có dữ liệu và gán vào state categories
        if (result && result.data && Array.isArray(result.data)) {
          setBlogs(result.data);
        } else {
          console.error("Invalid data format:", result);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchBlogs();
  }, []);
  return (
    // <Layout q={10}>
    <div>
      <div className="main-content">
        {/* Slider */}
        <section className="section-slide">
          <div className="wrap-slick1 rs1-slick1">
            <div className="slick1">
              <div
                className="item-slick1"
                style={{ backgroundImage: "url(images/slide-03.jpg)" }}
              >
                <div className="container h-full">
                  <div className="flex-col-l-m h-full p-t-100 p-b-30">
                    <span className="ltext-202 cl2 respon2">
                      Men Collection 2018
                    </span>
                    <h2 className="ltext-104 cl2 p-t-19 p-b-43 respon1">
                      New arrivals
                    </h2>
                    <a
                      href="/"
                      className="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04"
                    >
                      Shop Now
                    </a>
                  </div>
                </div>
              </div>
              {/* Thêm các mục slider khác nếu cần */}
            </div>
          </div>
        </section>

        {/* Banner */}
        <div className="sec-banner bg0">
          <div className="flex-w flex-c-m">
            {/* Phần tử 1 */}
            <div className="size-202 m-lr-auto respon4">
              <div className="block1 wrap-pic-w">
                <img src="images/banner-04.jpg" alt="IMG-BANNER" />
                <a
                  href="/"
                  className="block1-txt ab-t-l s-full flex-col-l-sb p-lr-38 p-tb-34 trans-03 respon3"
                >
                  <div className="block1-txt-child1 flex-col-l">
                    <span className="block1-name ltext-102 trans-04 p-b-8">
                      Women
                    </span>
                    <span className="block1-info stext-102 trans-04">
                      Spring 2018
                    </span>
                  </div>
                  <div className="block1-txt-child2 p-b-4 trans-05">
                    <div className="block1-link stext-101 cl0 trans-09">
                      Shop Now
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Phần tử 2 */}
            <div className="size-202 m-lr-auto respon4">
              <div className="block1 wrap-pic-w">
                <img src="images/banner-05.jpg" alt="IMG-BANNER" />
                <a
                  href="/"
                  className="block1-txt ab-t-l s-full flex-col-l-sb p-lr-38 p-tb-34 trans-03 respon3"
                >
                  <div className="block1-txt-child1 flex-col-l">
                    <span className="block1-name ltext-102 trans-04 p-b-8">
                      Men
                    </span>
                    <span className="block1-info stext-102 trans-04">
                      Spring 2018
                    </span>
                  </div>
                  <div className="block1-txt-child2 p-b-4 trans-05">
                    <div className="block1-link stext-101 cl0 trans-09">
                      Shop Now
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Phần tử 3 */}
            <div className="size-202 m-lr-auto respon4">
              <div className="block1 wrap-pic-w">
                <img src="images/banner-06.jpg" alt="IMG-BANNER" />
                <a
                  href="/"
                  className="block1-txt ab-t-l s-full flex-col-l-sb p-lr-38 p-tb-34 trans-03 respon3"
                >
                  <div className="block1-txt-child1 flex-col-l">
                    <span className="block1-name ltext-102 trans-04 p-b-8">
                      Accessories
                    </span>
                    <span className="block1-info stext-102 trans-04">
                      Spring 2018
                    </span>
                  </div>
                  <div className="block1-txt-child2 p-b-4 trans-05">
                    <div className="block1-link stext-101 cl0 trans-09">
                      Shop Now
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        <section className="sec-product bg0 p-t-100 p-b-50">
          <div className="container">
            <div className="p-b-32">
              <h3 className="ltext-105 cl5 txt-center respon1">Tổng quan</h3>
            </div>

            {/* Tab sản phẩm */}
            <div className="tab01">
              <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item p-b-10">
                  <a
                    className="nav-link active"
                    data-toggle="tab"
                    href="#best-seller"
                    role="tab"
                  >
                    Bán chạy
                  </a>
                </li>
                <li className="nav-item p-b-10">
                  <a
                    className="nav-link"
                    data-toggle="tab"
                    href="#featured"
                    role="tab"
                  >
                    Nổi bật
                  </a>
                </li>
                <li className="nav-item p-b-10">
                  <a
                    className="nav-link"
                    data-toggle="tab"
                    href="#sale"
                    role="tab"
                  >
                    Giảm giá
                  </a>
                </li>
              </ul>

              {/* Nội dung các tab */}
              <div className="tab-content p-t-50">
                <div
                  className="tab-pane fade show active"
                  id="best-seller"
                  role="tabpanel"
                >
                  <div className="wrap-slick2">
                    <div className="slick2">
                      {/* Sản phẩm - 4 sản phẩm xếp ngang nhau */}

                      <div className="flex-w flex-sb-m p-l-15 p-r-15">
                        {/* Sản phẩm  */}
                        {products.map((product) => (
                          <div
                            key={product.id}
                            className="item-slick2 p-l-15 p-r-15 p-t-15 p-b-15"
                            style={{ width: "25%" }}
                          >
                            <div className="block2">
                              <div className="block2-pic hov-img0">
                                <Link to={`/products/${product.id}`}>
                                  {product.image && (
                                    <img
                                      // src={product.image}
                                      src={`http://127.0.0.1:8000/storage/${product.image.image_url}`}
                                      alt={product.name}
                                      style={{
                                        width: "100%",
                                        height: "auto",
                                      }}
                                    />
                                  )}
                                </Link>
                                <Link
                                  to={`/products/${product.id}`}
                                  className="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 js-show-modal1"
                                >
                                  Mua Ngay
                                </Link>
                              </div>
                              <div className="block2-txt flex-w flex-t p-t-14">
                                <div className="block2-txt-child1 flex-col-l">
                                  <Link
                                    to={`/products/${product.id}`}
                                    className="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6"
                                  >
                                    {product.name}
                                  </Link>
                                  <span className="stext-105 cl3">
                                    ${product.price}
                                  </span>
                                </div>
                                <Heart product_id={product.id} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Thêm các sản phẩm khác nếu cần */}
                    </div>
                  </div>
                </div>
                {/* Các tab khác */}
              </div>
              <div className="flex-c-m flex-w w-full p-t-45">
                <a
                  href="/products"
                  className="flex-c-m stext-101 cl5 size-103 bg2 bor1 hov-btn1 p-lr-15 trans-04"
                >
                  Xem tất cả
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="sec-blog bg0 p-t-60 p-b-90">
          <div className="container">
            <div className="p-b-66">
              <h3 className="ltext-105 cl5 txt-center">
                Bài viết của chúng tôi
              </h3>
            </div>

            <div className="row">
              {/* Bài blog 1 */}
              {blogs.slice(0, 3).map((blog, index) => (
                <div key={index} className="col-sm-6 col-md-4 p-b-40">
                  <div className="blog-item">
                    <div className="hov-img0">
                      <a href="/blogs">
                        <img
                          style={{ width: "520px", height: "300px" }}
                          src={`http://127.0.0.1:8000/storage/${blog.image}`}
                          alt={`Blog: ${blog.image}`}
                        />
                      </a>
                    </div>
                    <div className="p-t-15">
                      <h4 className="p-b-5">
                        <a href="/" className="mtext-101 cl2 hov-cl1 trans-04">
                          {blog.title}
                        </a>
                      </h4>
                      <span className="stext-108 cl6 p-t-10">
                        {new Date(blog.created_at).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                        })}
                      </span>
                      <p className="stext-108 cl6 p-t-10">
                        {/* Cắt nội dung */}
                        {blog.content.length > 100
                          ? `${blog.content.substring(0, 100)}...`
                          : blog.content}
                        {blog.content.length > 100 && (
                          <a
                            href="#"
                            className="mtext-102 cl2 hov-cl1 trans-04"
                          >
                            Xem thêm
                          </a>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex-c-m flex-w w-full p-t-45">
              <a
                href="/products"
                className="flex-c-m stext-101 cl5 size-103 bg2 bor1 hov-btn1 p-lr-15 trans-04"
              >
                Xem tất cả
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
    // </Layout>
  );
};

export default Home;
