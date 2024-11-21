import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AccountDropdown from "./AccountDropdown";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setSearchRedux } from "../store/searchSlice";
type Props = {
  quantity: number;
};
interface Category {
  id: number;
  name: string;
}
const Header: React.FC<Props> = ({ quantity }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const [userName, setUserName] = useState<string | null>("");
  const [key, setKey] = useState<string | null>("");
  const dispatch = useDispatch();
  const quantityCart = useSelector(
    (state: RootState) => state.quantity.quantity
  );
  const quantityFavorites = useSelector(
    (state: RootState) => state.favorites.quantity
  );
  const ids = useSelector((state: RootState) => state.favorites.items);

  const [categories, setCategories] = useState<Category[]>([]);

  // console.log(useSelector((state: RootState) => state.quantity));
  useEffect(() => {
    if (token) {
      const user = localStorage.getItem("user_name");
      setUserName(user);
    }
  }, [token]);

  const updateUserName = (name: string) => {
    setUserName(name);
  };

  const handleLogout = async () => {
    try {
      if (!token) {
        console.error("No access token found");
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/api/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const responseText = await response.text();

      if (response.ok) {
        localStorage.removeItem("access_token");
        setUserName(null);
        message.success("Đăng xuất thành công");
        navigate("/"); // Thông báo thành công
      } else {
        console.error("Logout error:", {
          status: response.status,
          statusText: response.statusText,
          response: responseText,
        });
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  const searchkey = () => {
    // navigate(`/search?q=${key}`);
    if (key) {
      dispatch(setSearchRedux(key));
      setKey("");
    }
  };
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/categories");

        // Kiểm tra nếu phản hồi từ server là thành công
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Kiểm tra nếu có dữ liệu và gán vào state categories
        if (result && result.data && Array.isArray(result.data)) {
          setCategories(result.data);
        } else {
          console.error("Invalid data format:", result);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []); // Chạy chỉ một lần khi component được mount

  return (
    <header className="header-v2">
      {/* Header desktop */}
      <div className="container-menu-desktop trans-03">
        <div className="wrap-menu-desktop">
          <nav className="limiter-menu-desktop p-l-45">
            {/* Logo desktop */}
            <a
              href="/"
              className="logo"
              style={{
                color: "inherit",
                textDecoration: "none",
                fontWeight: "900",
              }}
            >
              <p>BEE STORE</p>
            </a>
            {/* Menu desktop */}
            <div className="menu-desktop">
              <ul className="main-menu">
                <li className="active-menu">
                  <Link to="/">Trang chủ</Link>
                </li>
                <li>
                  <Link to="/products">Sản phẩm</Link>
                </li>
                {/* {categories.map((category,index) => ( */}
                <li className="relative active-menu">
                  <Link to="">Danh Mục</Link>

                  <ul className="sub-menu absolute left-1/2 transform -translate-x-1/2 mt-2 w-40 bg-white shadow-lg rounded-md text-center">
                    {" "}
                    {categories.map((category, index) => (
                      <li key={index} className="relative">
                        <Link
                          to="/sub-category"
                          className="flex items-center justify-between px-4 hover:bg-gray-200"
                          style={{ textAlign: "left" }}
                        >
                          <div style={{ display: "flex" }}>
                            <div style={{ width: "90%" }}>
                              <span>{category.name}</span>
                            </div>
                            <div style={{ width: "10%" }}>
                              <i
                                className="fa-solid fa-chevron-right"
                                style={{ justifyContent: "end" }}
                              ></i>
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                    {/* <li className="relative">
                      <Link
                        to="/sub-category"
                        className="block px-4 hover:bg-gray-200"
                      >
                        Danh mục 2
                        <i className="fa-solid fa-chevron-right pl-4"></i>
                      </Link>
                      <ul className="sub-menu absolute left-1/2 transform -translate-x-1/2 mt-2 w-40 bg-white shadow-lg rounded-md text-center">
                        <li className="py-2">
                          <Link
                            to="/sub-category-1"
                            className="block px-4 hover:bg-gray-200"
                          >
                            Danh mục con 1
                          </Link>
                        </li>
                        <li className="py-2">
                          <Link
                            to="/sub-category-2"
                            className="block px-4 hover:bg-gray-200"
                          >
                            Danh mục con 2
                          </Link>
                        </li>
                        <li className="py-2">
                          <Link
                            to="/sub-category-3"
                            className="block px-4 hover:bg-gray-200"
                          >
                            Danh mục con 3
                          </Link>
                        </li>
                      </ul>
                    </li> */}
                  </ul>
                </li>

                <li>
                  <Link to="/contact">Liên hệ</Link>
                </li>
                <li>
                  <Link to="/blog">Bài viết</Link>
                </li>
              </ul>
            </div>
            {/* Icon header */}
            <div className="wrap-icon-header flex-w flex-r-m h-full">
              {/* Icon search */}
              <div className="flex-c-m h-full p-r-24">
                <div className="icon-header-item cl2 hov-cl1 trans-04 p-lr-11 js-show-modal-search">
                  <Link to={"/products"}>
                    <i
                      className="zmdi zmdi-search"
                      onClick={() => searchkey()}
                    />
                  </Link>
                </div>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Tìm kiếm..."
                  onChange={(e) => setKey(e.target.value)}
                />
              </div>

              {/* Icon user */}
              <AccountDropdown userName={userName} onLogout={handleLogout} />

              {/* Icon cart */}

              <div className="flex-c-m h-full p-l-18 p-r-70 bor5">
                <div
                  className="icon-header-item cl2 hov-cl1 trans-04 p-lr-11 icon-header-noti js-show-cart"
                  data-notify={quantityCart}
                >
                  <Link
                    to="/carts"
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    <i className="zmdi zmdi-shopping-cart" />
                  </Link>
                </div>
                <div
                  className="icon-header-item cl2 hov-cl1 trans-04 p-lr-11 icon-header-noti js-show-cart"
                  data-notify={ids.length}
                  style={{ color: "red" }}
                >
                  <Link
                    to="/wishlist"
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    <i className="fa-solid fa-heart"></i>
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
      {/* Header Mobile */}
      <div className="wrap-header-mobile">
        {/* Logo moblie */}
        <div className="logo-mobile">
          <a href="/">
            <p>BEE STORE</p>
          </a>
        </div>
        {/* Icon header */}
        <div className="wrap-icon-header flex-w flex-r-m h-full m-r-15">
          <div className="flex-c-m h-full p-r-10">
            <div className="icon-header-item cl2 hov-cl1 trans-04 p-lr-11 js-show-modal-search">
              <i className="zmdi zmdi-search" />
            </div>
          </div>
          <div className="flex-c-m h-full p-lr-10 bor5">
            <div
              className="icon-header-item cl2 hov-cl1 trans-04 p-lr-11 icon-header-noti js-show-cart"
              data-notify={quantityCart}
            >
              <i className="zmdi zmdi-shopping-cart" />
            </div>
          </div>
          <AccountDropdown userName={userName} onLogout={handleLogout} />
        </div>
        {/* Button show menu */}
      </div>
      {/* Menu Mobile */}
      <div className="menu-mobile">
        <ul className="main-menu-m">
          <li>
            <a href="/">Home</a>
            <ul className="sub-menu-m">
              <li>
                <a href="/">Homepage 1</a>
              </li>
              <li>
                <a href="home-02.html">Homepage 2</a>
              </li>
              <li>
                <a href="home-03.html">Homepage 3</a>
              </li>
            </ul>
            <span className="arrow-main-menu-m">
              <i className="fa fa-angle-right" aria-hidden="true" />
            </span>
          </li>
          <li>
            <a href="products">Shop</a>
          </li>
          <li>
            <a
              href="shoping-cart.html"
              className="label1 rs1"
              data-label1="hot"
            >
              Features
            </a>
          </li>
          <li>
            <a href="blog.html">Bài viết</a>
          </li>
          <li>
            <a href="about.html">About</a>
          </li>
          <li>
            <a href="contact.html">Contact</a>
          </li>
        </ul>
      </div>
      {/* Modal Search */}
      <div className="modal-search-header flex-c-m trans-04 js-hide-modal-search">
        <div className="container-search-header">
          <button className="flex-c-m btn-hide-modal-search trans-04 js-hide-modal-search">
            {/* <img src="images/icons/icon-close2.png" alt="CLOSE" /> */}
          </button>
          <form className="wrap-search-header flex-w p-l-15">
            <button className="flex-c-m trans-04">
              <i className="zmdi zmdi-search" />
            </button>
            <input
              className="plh3"
              type="text"
              name="search"
              placeholder="Search..."
            />
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;
