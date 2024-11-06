import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountDropdown from "./AccountDropdown";

type Props = {};

const Header = (props: Props) => {
  const token = localStorage.getItem("access_token");
  const [userName, setUserName] = useState<string | null>("");
  useEffect(() => {
    if (token) {
      const user = localStorage.getItem("user_name");
      setUserName(user);
      // console.log("hihi" + localStorage.getItem("user_name"));
    }
  }, [token]);

  // console.log(token);

  const handleLogout = async () => {
    // localStorage.removeItem("access_token");
    // setUserName(null);
    // return;
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

      const responseText = await response.text(); // Đọc nội dung phản hồi dưới dạng text

      if (response.ok) {
        localStorage.removeItem("access_token");
        setUserName(null);
        console.log("Logout successful");
        // window.location.reload();
      } else {
        console.error("Logout error:", {
          status: response.status,
          statusText: response.statusText,
          response: responseText, // Hiển thị nội dung phản hồi
        });
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

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
                <li className="relative active-menu">
                  <Link to="/category">Danh mục</Link>
                  <ul className="sub-menu absolute left-1/2 transform -translate-x-1/2 mt-2 w-40 bg-white shadow-lg rounded-md text-center">
                    <li className="relative">
                      <Link
                        to="/sub-category"
                        className="block px-4 hover:bg-gray-200"
                      >
                        Danh mục 1
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
                    </li>
                    <li className="relative">
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
                    </li>
                    <li className="relative">
                      <Link
                        to="/sub-category"
                        className="block px-4 hover:bg-gray-200"
                      >
                        Danh mục 3
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
                    </li>
                  </ul>
                </li>

                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
                <li>
                  <Link to="/blog">Blog</Link>
                </li>
              </ul>
            </div>
            {/* Icon header */}
            <div className="wrap-icon-header flex-w flex-r-m h-full">
              {/* Icon search */}
              <div className="flex-c-m h-full p-r-24">
                <div className="icon-header-item cl2 hov-cl1 trans-04 p-lr-11 js-show-modal-search">
                  <i className="zmdi zmdi-search" />
                </div>
              </div>

              {/* Icon user */}
              <AccountDropdown userName={userName} onLogout={handleLogout} />

              {/* Icon cart */}

              <div className="flex-c-m h-full p-l-18 p-r-70 bor5">
                <div
                  className="icon-header-item cl2 hov-cl1 trans-04 p-lr-11 icon-header-noti js-show-cart"
                  data-notify={2}
                >
                  <Link
                    to="/carts"
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    <i className="zmdi zmdi-shopping-cart" />
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
              data-notify={2}
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
            <a href="blog.html">Blog</a>
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
            <img src="images/icons/icon-close2.png" alt="CLOSE" />
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
