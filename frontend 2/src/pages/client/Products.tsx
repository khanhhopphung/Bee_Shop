import React, { useEffect, useState } from "react";
import ProductItem from "../../components/ProductItem";
import Layout from "../../components/Layout";
import { Pagination } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { setSearchRedux } from "../../store/searchSlice";
import { AppDispatch } from "../../store/store";
const Products: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All Products");
  const [products, setProducts] = useState<any[]>([]);
  const key = useSelector((state: RootState) => state.Search.key);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/products");

        // Kiểm tra nếu phản hồi từ server là thành công
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Kiểm tra nếu có dữ liệu và nó là một mảng
        if (result && result.data && Array.isArray(result.data)) {
          console.log(result.data.slice(0, 8)); // Log 8 sản phẩm đầu tiên
          setProducts(result.data.slice(0, 8)); // Lưu 8 sản phẩm vào state
        } else {
          console.error("Data is not valid:", result);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    // setSearch(event.target.value);
    dispatch(setSearchRedux(event.target.value));
  };

  const handleFilter = (filter: string) => {
    setSelectedFilter(filter);
  };

  const [isVisible, setIsVisible] = useState(false);

  // Hàm toggle hiển thị
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    // <Layout q={10}>
    <div className="bg0 m-t-23 p-b-140">
      <div className="container">
        {/* Bộ lọc sản phẩm và Tìm kiếm */}
        <div className="flex-w flex-sb-m p-b-52">
          <div className="flex-w flex-l-m filter-tope-group m-tb-10">
            {["All Products", "Women", "Men", "Bag", "Shoes", "Watches"].map(
              (filter) => (
                <button
                  key={filter}
                  className={`stext-106 cl6 hov1 bor3 trans-04 m-r-32 m-tb-5 ${
                    selectedFilter === filter ? "how-active1" : ""
                  }`}
                  onClick={() => handleFilter(filter)}
                >
                  {filter}
                </button>
              )
            )}
          </div>

          {/* Tìm kiếm sản phẩm */}
          <div className="dis-flex m-tb-10">
            <div className="bor8 dis-flex p-l-15 align-center">
              <button
                style={{ width: "200px" }}
                className="size-113 flex-c-m fs-16 cl2 hov-cl1 trans-04 "
                onClick={toggleVisibility}
              >
                <i className="fa-solid fa-arrow-up-a-z pr-3"> </i>Lọc sản phẩm
              </button>
            </div>

            {/* Thêm khoảng cách 2cm ở đây */}
            <div className="ml-8">
              {" "}
              {/* Bạn có thể thay đổi giá trị này nếu cần */}
              <div className="bor8 dis-flex p-l-15 align-center">
                <button className="size-113 flex-c-m fs-16 cl2 hov-cl1 trans-04">
                  <i className="zmdi zmdi-search"></i>
                </button>
                <input
                  className="mtext-107 cl2 size-114 plh2 p-r-15"
                  type="text"
                  placeholder="Search"
                  value={key}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className={
            isVisible
              ? "panel-filter w-full p-t-10"
              : "dis-none panel-filter w-full p-t-10 mb-4"
          }
          id="fi"
          style={{ marginBottom: isVisible ? "0.5cm" : "0" }}
        >
          <div className="wrap-filter flex-w bg6 w-full p-lr-40 p-t-27 p-lr-15-sm">
            <div className="filter-col1 p-r-15 p-b-27">
              <div className="mtext-102 cl2 p-b-15">Sort By</div>
              <ul>
                <li className="p-b-6">
                  <a href="#" className="filter-link stext-106 trans-04">
                    Default
                  </a>
                </li>
                <li className="p-b-6">
                  <a href="#" className="filter-link stext-106 trans-04">
                    Popularity
                  </a>
                </li>
                <li className="p-b-6">
                  <a href="#" className="filter-link stext-106 trans-04">
                    Average rating
                  </a>
                </li>
                <li className="p-b-6">
                  <a
                    href="#"
                    className="filter-link stext-106 trans-04 filter-link-active"
                  >
                    Newness
                  </a>
                </li>
                <li className="p-b-6">
                  <a href="#" className="filter-link stext-106 trans-04">
                    Price: Low to High
                  </a>
                </li>
                <li className="p-b-6">
                  <a href="#" className="filter-link stext-106 trans-04">
                    Price: High to Low
                  </a>
                </li>
              </ul>
            </div>
            <div className="filter-col2 p-r-15 p-b-27">
              <div className="mtext-102 cl2 p-b-15">Price</div>
              <ul>
                <li className="p-b-6">
                  <a
                    href="#"
                    className="filter-link stext-106 trans-04 filter-link-active"
                  >
                    All
                  </a>
                </li>
                <li className="p-b-6">
                  <a href="#" className="filter-link stext-106 trans-04">
                    $0.00 - $50.00
                  </a>
                </li>
                <li className="p-b-6">
                  <a href="#" className="filter-link stext-106 trans-04">
                    $50.00 - $100.00
                  </a>
                </li>
                <li className="p-b-6">
                  <a href="#" className="filter-link stext-106 trans-04">
                    $100.00 - $150.00
                  </a>
                </li>
                <li className="p-b-6">
                  <a href="#" className="filter-link stext-106 trans-04">
                    $150.00 - $200.00
                  </a>
                </li>
                <li className="p-b-6">
                  <a href="#" className="filter-link stext-106 trans-04">
                    $200.00+
                  </a>
                </li>
              </ul>
            </div>
            <div className="filter-col3 p-r-15 p-b-27">
              <div className="mtext-102 cl2 p-b-15">Color</div>
              <ul>
                <li className="p-b-6">
                  <span className="fs-15 lh-12 m-r-6" style={{ color: "#222" }}>
                    <i className="zmdi zmdi-circle" />
                  </span>
                  <a href="#" className="filter-link stext-106 trans-04">
                    Black
                  </a>
                </li>
                <li className="p-b-6">
                  <span
                    className="fs-15 lh-12 m-r-6"
                    style={{ color: "#4272d7" }}
                  >
                    <i className="zmdi zmdi-circle" />
                  </span>
                  <a
                    href="#"
                    className="filter-link stext-106 trans-04 filter-link-active"
                  >
                    Blue
                  </a>
                </li>
                <li className="p-b-6">
                  <span
                    className="fs-15 lh-12 m-r-6"
                    style={{ color: "#b3b3b3" }}
                  >
                    <i className="zmdi zmdi-circle" />
                  </span>
                  <a href="#" className="filter-link stext-106 trans-04">
                    Grey
                  </a>
                </li>
                <li className="p-b-6">
                  <span
                    className="fs-15 lh-12 m-r-6"
                    style={{ color: "#00ad5f" }}
                  >
                    <i className="zmdi zmdi-circle" />
                  </span>
                  <a href="#" className="filter-link stext-106 trans-04">
                    Green
                  </a>
                </li>
                <li className="p-b-6">
                  <span
                    className="fs-15 lh-12 m-r-6"
                    style={{ color: "#fa4251" }}
                  >
                    <i className="zmdi zmdi-circle" />
                  </span>
                  <a href="#" className="filter-link stext-106 trans-04">
                    Red
                  </a>
                </li>
                <li className="p-b-6">
                  <span className="fs-15 lh-12 m-r-6" style={{ color: "#aaa" }}>
                    <i className="zmdi zmdi-circle-o" />
                  </span>
                  <a href="#" className="filter-link stext-106 trans-04">
                    White
                  </a>
                </li>
              </ul>
            </div>
            <div className="filter-col4 p-b-27">
              <div className="mtext-102 cl2 p-b-15">Tags</div>
              <div className="flex-w p-t-4 m-r--5">
                <a
                  href="#"
                  className="flex-c-m stext-107 cl6 size-301 bor7 p-lr-15 hov-tag1 trans-04 m-r-5 m-b-5"
                >
                  Fashion
                </a>
                <a
                  href="#"
                  className="flex-c-m stext-107 cl6 size-301 bor7 p-lr-15 hov-tag1 trans-04 m-r-5 m-b-5"
                >
                  Lifestyle
                </a>
                <a
                  href="#"
                  className="flex-c-m stext-107 cl6 size-301 bor7 p-lr-15 hov-tag1 trans-04 m-r-5 m-b-5"
                >
                  Denim
                </a>
                <a
                  href="#"
                  className="flex-c-m stext-107 cl6 size-301 bor7 p-lr-15 hov-tag1 trans-04 m-r-5 m-b-5"
                >
                  Streetstyle
                </a>
                <a
                  href="#"
                  className="flex-c-m stext-107 cl6 size-301 bor7 p-lr-15 hov-tag1 trans-04 m-r-5 m-b-5"
                >
                  Crafts
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="row isotope-grid">
          {products
            .filter(
              (product) =>
                selectedFilter === "All Products" ||
                product.category === selectedFilter
            )
            .filter((product) =>
              product.name.toLowerCase().includes(key.toLowerCase())
            )
            .map((product) => (
              // <>{console.log(product)}</>
              <ProductItem key={product.id} {...product} />
            ))}
        </div>

        {/* Nút tải thêm sản phẩm */}
        <div className="flex-c-m flex-w w-full p-t-45">
          <Pagination defaultCurrent={6} total={100} />
        </div>
      </div>
    </div>
    // </Layout>
  );
};

export default Products;
