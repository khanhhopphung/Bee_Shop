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
  const truncateProductName = (name: string, maxWords: number = 8) => {
    const words = name.split(" ");
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(" ") + "...";
    }
    return name;
  };
  const [categories, setCategories] = useState<Category[]>([
    { id: 0, name: "Tất cả sản phẩm" }, // Đối tượng phải nằm trong ngoặc nhọn
  ]);
  // Khai báo state cho sắp xếp
  const [selectedSort, setSelectedSort] = useState<string>("related");
  const [selectedPrice, setSelectedPrice] = useState<string>();
  const dispatch = useDispatch<AppDispatch>();
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Tất cả sản phẩm");
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const key = useSelector((state: RootState) => state.Search.key);
  const [list, setList] = useState([]);
  const [currentPage, setCurrentPage] = useState<number>(1); // Trạng thái cho trang hiện tại
  const productsPerPage = 12;
  const [productCache, setProductCache] = useState<Product[]>([]);

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
          setProductCache(result.data);
        } else {
          console.error("Data is not valid:", result);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Sắp xếp sản phẩm theo giá trị đã chọn
  useEffect(() => {
    let sortedProducts: Product[] = [...products];
    if (selectedPrice === "highToLow") {
      sortedProducts.sort((a, b) => b.price_min - a.price_min);
    } else if (selectedPrice === "lowToHigh") {
      sortedProducts.sort((a, b) => a.price_min - b.price_min);
    }
    setProducts(sortedProducts);
  }, [selectedPrice]);
  useEffect(() => {
    const fetchProducts = async () => {
      console.log(selectedSort);
      await selected();
    };
    fetchProducts();
  }, [selectedSort]);
  useEffect(() => {
    const fetchProducts = async () => {
      console.log(selectedSort);
      await selectednewest();
    };
    fetchProducts();
  }, [selectedSort]);

  const selected = async () => {
    if (selectedSort === "bestSeller") {
      const response = await fetch("http://127.0.0.1:8000/api/best-products");
      const result = await response.json();
      console.log(result);
      if (result && result.data && Array.isArray(result.data)) {
        setProducts(result.data);
      }
    } else if (selectedSort === "related") {
      setProducts(productCache);
    }
  };
  const selectednewest = async () => {
    if (selectedSort === "newest") {
      const response = await fetch(`http://127.0.0.1:8000/api/latest-products`);
      const result = await response.json();
      console.log(result);
      if (result && result.data && Array.isArray(result.data)) {
        setProducts(result.data);
      }
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    // setSearch(event.target.value);
    dispatch(setSearchRedux(event.target.value));
  };

  const handleFilter = (id: number) => {
    setSelectedCategory(id);
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
            {/* <div className="bor8 dis-flex p-l-15 align-center">
              <button
                style={{ width: "200px" }}
                className="size-113 flex-c-m fs-16 cl2 hov-cl1 trans-04 "
                onClick={toggleVisibility}
              >
                <i className="fa-solid fa-arrow-up-a-z pr-3"> </i>Lọc sản phẩm
              </button>
            </div> */}

            {/* Thêm khoảng cách 2cm ở đây */}
            <div className="ml-8">
              {/* tìm kiếm*/}
              {/* <div className="bor8 dis-flex p-l-15 align-center">
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
              </div> */}
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
            <div className="filter-col2 p-r-15 p-b-27">
              <div className="mtext-102 cl2 p-b-15">Giá</div>
              <ul>
                <li className="p-b-6">
                  <a href="#" className="filter-link stext-106 trans-04 ">
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
            <div className="filter-col2 p-r-15 p-b-27">
              <div className="mtext-102 cl2 p-b-15">Kích cỡ</div>
              <ul>
                <li className="p-b-6">
                  <a href="#" className="filter-link stext-106 trans-04 ">
                    Tất cả
                  </a>
                </li>
                <li className="p-b-6">
                  <a href="#" className="filter-link stext-106 trans-04">
                    Size S
                  </a>
                </li>
                <li className="p-b-6">
                  <a href="#" className="filter-link stext-106 trans-04">
                    Size M
                  </a>
                </li>
                <li className="p-b-6">
                  <a href="#" className="filter-link stext-106 trans-04">
                    Size L
                  </a>
                </li>
                <li className="p-b-6">
                  <a href="#" className="filter-link stext-106 trans-04">
                    Size XL
                  </a>
                </li>
              </ul>
            </div>
            {/* Nút lọc */}
            <div>
              <button onClick={() => console.log("Apply filter")}>Lọc</button>
            </div>
          </div>
        </div>
        <div className="sort-section">
          <span className="sort-label">Sắp xếp theo</span>
          <div className="sort-options">
            <button
              className={`sort-option ${
                selectedSort === "related" ? "active" : ""
              }`}
              onClick={() => setSelectedSort("related")}
            >
              Mặc định
            </button>
            <button
              className={`sort-option ${
                selectedSort === "newest" ? "active" : ""
              }`}
              onClick={() => setSelectedSort("newest")}
            >
              Mới Nhất
            </button>
            <button
              className={`sort-option ${
                selectedSort === "bestSeller" ? "active" : ""
              }`}
              onClick={() => setSelectedSort("bestSeller")}
            >
              Bán Chạy
            </button>
            <div className="dropdown">
              <button className="sort-option">
                {selectedPrice === "lowToHigh"
                  ? "Giá: Thấp đến Cao"
                  : selectedPrice === "highToLow"
                  ? "Giá: Cao đến Thấp"
                  : "Giá"}{" "}
                <i className="fa fa-chevron-down"></i>
              </button>
              <div className="dropdown-content">
                <button onClick={() => setSelectedPrice("lowToHigh")}>
                  Giá: Thấp đến Cao
                </button>
                <button onClick={() => setSelectedPrice("highToLow")}>
                  Giá: Cao đến Thấp
                </button>
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
