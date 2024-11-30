import React, { useEffect, useState } from "react";
import ProductItem from "../../components/ProductItem";
import Layout from "../../components/Layout";
import { Pagination } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { setSearchRedux } from "../../store/searchSlice";
import { AppDispatch } from "../../store/store";
import { addToFavorites, removeFromFavorites } from "../../store/favoriteSlice";
import CategoryPage from "./CategoryPage";
// import Heart from "../../components/Heart";
interface Product {
  id: number;
  name: string;
  price_max: number;
  price_min: number;
  image_url: string;
  category_id: number;
}
interface Category {
  id: number;
  name: string;
}
const Products: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([
    { id: 0, name: "Tất cả sản phẩm" }, // Đối tượng phải nằm trong ngoặc nhọn
  ]);
  const dispatch = useDispatch<AppDispatch>();
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Tất cả sản phẩm");
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const key = useSelector((state: RootState) => state.Search.key);
  const [list, setList] = useState([]);
  const [currentPage, setCurrentPage] = useState<number>(1); // Trạng thái cho trang hiện tại
  const productsPerPage = 12;

  // call api category

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/categories");

        // Kiểm tra nếu phản hồi từ server là thành công
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result && result.data && Array.isArray(result.data)) {
          setCategories((prev) => [...prev, ...result.data]);
          console.log(result.data);
        } else {
          console.error("Invalid data format:", result);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // call api products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/all-products");

        // Kiểm tra nếu phản hồi từ server là thành công
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Kiểm tra nếu có dữ liệu và nó là một mảng
        if (result && result.data && Array.isArray(result.data)) {
          setProducts(result.data);
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

  const handleFilter = (id: number) => {
    setSelectedCategory(id);
    // setSelectedFilter(filter);
  };

  const [isVisible, setIsVisible] = useState(false);

  // Hàm toggle hiển thị
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // Cập nhật trang khi người dùng thay đổi
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Tính toán các sản phẩm hiển thị trong trang hiện tại
  const filteredProducts = products
    .filter(
      (product) =>
        selectedCategory === 0 || product.category_id === selectedCategory
    )
    .filter((product) =>
      product.name.toLowerCase().includes(key.toLowerCase())
    );

  const currentPageProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    // <Layout q={10}>
    <div className="bg0 m-t-23 p-b-140">
      <div className="container">
        {/* Bộ lọc sản phẩm và Tìm kiếm */}
        <div className="flex-w flex-sb-m p-b-52">
          <div className="flex-w flex-l-m filter-tope-group m-tb-10">
            {categories.map((item, index) => (
              <button
                key={index}
                className={`stext-106 cl6 hov1 bor3 trans-04 m-r-32 m-tb-5 ${
                  selectedCategory === item.id ? "how-active1" : ""
                }`}
                onClick={() => handleFilter(item.id)}
              >
                {item.name}
              </button>
            ))}
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
                  placeholder="Tìm kiếm"
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
          style={{
            marginBottom: isVisible ? "0.5cm" : "0",
            marginTop: "-54px",
          }}
        >
          <div className="wrap-filter flex-w bg6 w-full p-lr-40 p-t-27 p-lr-15-sm">
            <div className="filter-col1 p-r-15 p-b-27">
              <div className="mtext-102 cl2 p-b-15">Lọc theo</div>
              <ul>
                <li className="p-b-6">
                  <a href="#" className="filter-link stext-106 trans-04">
                    Mặc định
                  </a>
                </li>
                <li className="p-b-6">
                  <a href="#" className="filter-link stext-106 trans-04">
                    Mua nhiều
                  </a>
                </li>
                <li className="p-b-6">
                  <a
                    href="#"
                    className="filter-link stext-106 trans-04 filter-link-active"
                  >
                    Mới nhất
                  </a>
                </li>
                <li className="p-b-6">
                  <a href="#" className="filter-link stext-106 trans-04">
                    Giá: Thấp đến cao
                  </a>
                </li>
                <li className="p-b-6">
                  <a href="#" className="filter-link stext-106 trans-04">
                    Price: Cao đến thấp
                  </a>
                </li>
              </ul>
            </div>
            <div className="filter-col2 p-r-15 p-b-27">
              <div className="mtext-102 cl2 p-b-15">Giá</div>
              <ul>
                <li className="p-b-6">
                  <a
                    href="#"
                    className="filter-link stext-106 trans-04 filter-link-active"
                  >
                    Tất cả
                  </a>
                </li>
                <li className="p-b-6">
                  <a href="#" className="filter-link stext-106 trans-04">
                    0đ - 100.000đ
                  </a>
                </li>
                <li className="p-b-6">
                  <a href="#" className="filter-link stext-106 trans-04">
                    100.000đ - 200.000đ
                  </a>
                </li>
                <li className="p-b-6">
                  <a href="#" className="filter-link stext-106 trans-04">
                    200.000đ - 500.000đ
                  </a>
                </li>
                <li className="p-b-6">
                  <a href="#" className="filter-link stext-106 trans-04">
                    500.000đ +
                  </a>
                </li>
              </ul>
            </div>
            <div className="filter-col3 p-r-15 p-b-27">
              <div className="mtext-102 cl2 p-b-15">Màu sắc</div>
              <ul>
                <li className="p-b-6">
                  <span className="fs-15 lh-12 m-r-6" style={{ color: "#222" }}>
                    <i className="zmdi zmdi-circle" />
                  </span>
                  <a href="#" className="filter-link stext-106 trans-04">
                    Đen
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
                    Xanh
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
                    Xám
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
                    Xánh lá
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
                    Đỏ
                  </a>
                </li>
                <li className="p-b-6">
                  <span className="fs-15 lh-12 m-r-6" style={{ color: "#aaa" }}>
                    <i className="zmdi zmdi-circle-o" />
                  </span>
                  <a href="#" className="filter-link stext-106 trans-04">
                    Trắng
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
          {currentPageProducts
            .filter(
              (product) =>
                selectedCategory === 0 ||
                product.category_id === selectedCategory
            )
            .filter((product) =>
              product.name.toLowerCase().includes(key.toLowerCase())
            )
            .map((product) => (
              <ProductItem key={product.id} {...product} />
            ))}
        </div>
        <>{console.log(currentPageProducts)}</>

        {/* Phân trang */}
        <div className="flex-c-m flex-w w-full p-t-45">
          <Pagination
            current={currentPage}
            total={filteredProducts.length}
            pageSize={productsPerPage}
            onChange={handlePageChange} // Cập nhật trang khi người dùng chọn
          />
        </div>
      </div>
    </div>
    // </Layout>
  );
};

export default Products;
