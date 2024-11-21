import React, { useEffect, useState } from "react";
import ProductItem from "../../components/ProductItem";
import Layout from "../../components/Layout";
import { Pagination } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { setSearchRedux } from "../../store/searchSlice";
import { AppDispatch } from "../../store/store";
import { addToFavorites, removeFromFavorites } from "../../store/favoriteSlice";
// import Heart from "../../components/Heart";
interface Product {
  id: number;
  name: string;
  price: string;
  image: { image_url: string };
  category_id: number;
  category: string;
}
const Products: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All Products");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const key = useSelector((state: RootState) => state.Search.key);
  const [list, setList] = useState([]);
  const [currentPage, setCurrentPage] = useState<number>(1); // Trạng thái cho trang hiện tại
  const productsPerPage = 12;

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

  const handleFilter = (filter: string) => {
    setSelectedFilter(filter);
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
  const currentPageProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );
  // Hàm lọc sản phẩm
  // const filteredProducts = products
  //   .filter(
  //     (product) =>
  //       selectedFilter === "All Products" || product.category === selectedFilter
  //   )
  //   .filter((product) => product.name.toLowerCase().includes(key.toLowerCase()))
  //   .filter((product) => {
  //     if (selectedPrice) {
  //       const price = parseFloat(product.price.replace(/[^0-9.-]+/g, ""));
  //       if (selectedPrice === "0-100k" && price <= 100000) return true;
  //       if (selectedPrice === "100k-200k" && price > 100000 && price <= 200000)
  //         return true;
  //       if (selectedPrice === "200k-500k" && price > 200000 && price <= 500000)
  //         return true;
  //       if (selectedPrice === "500k+" && price > 500000) return true;
  //       return false;
  //     }
  //     return true;
  //   })
  //   .filter((product) => {
  //     if (selectedColor) {
  //       return product.color.toLowerCase() === selectedColor.toLowerCase();
  //     }
  //     return true;
  //   });
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
                selectedFilter === "All Products" ||
                product.category === selectedFilter
            )
            .filter((product) =>
              product.name.toLowerCase().includes(key.toLowerCase())
            )
            .map((product) => (
              <ProductItem key={product.id} {...product} />
            ))}
        </div>

        {/* Phân trang */}
        <div className="flex-c-m flex-w w-full p-t-45">
          <Pagination
            current={currentPage}
            total={products.length}
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
