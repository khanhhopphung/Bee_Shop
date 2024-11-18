import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/client/Home";
import Products from "./pages/client/Products";
import ProductDetail from "./pages/client/ProductDetail";
import Carts from "./pages/client/Carts";
import CategoryPage from "./pages/client/CategoryPage";
import Register from "./pages/client/Register";
import Login from "./pages/client/Login";
import LoginAdmin from "./pages/admin/Login";
import RegisterAdmin from "./pages/admin/RegisterAdmin";
import EmailVerify from "./pages/client/EmailVerify";
import Blogs from "./pages/client/Blog";
import AdminLayout from "./pages/admin/MainLayouts";
import Layout from "./components/Layout";
import { message } from "antd";
import PaymentPage from "./pages/client/Checkout";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../src/store/store";
import { setQuantityCart } from "../src/store/quantityCartSlice";
import OrderSuccess from "./pages/client/OrderSuccess";
import NotFound from "./components/404";
import PrivacyPolicy from "./components/PrivacyPolicy";
import AccountPage from "./pages/client/AccountPage";
import OrderDetail from "./pages/client/OrderDetail";
import UpdatePass from "./pages/client/UpdatePass";
import Adrress from "./pages/client/Adrress";

import Categories from "./pages/admin/Categories";
import Promotions from "./pages/admin/Promotions";
import AdminBlogs from "./pages/admin/Blogs";
import Statistics from "./pages/admin/Statistics";

import Review from "./pages/admin/Review";
import ProductVariants from "./pages/admin/ProductVariant";

import Product from "./pages/admin/Product";
import Orders from "./pages/admin/Order";
import User from "./pages/admin/User";

interface CartItem {
  product_id: any;
  color_id: any;
  size_id: any;
  quantity: any;
  discount_value?: any;
}
interface Cart {
  product_id: any;
  color_id: any;
  size_id: any;
  quantity: any;
  discount_value?: any;
}
const App: React.FC = () => {
  const [cart, setCart] = useState<Cart[]>([]);
  const dispatch = useDispatch();
  const [cartItem, setCartItem] = useState<CartItem>();
  const token = localStorage.getItem("access_token");
  const cartDetailIds = useSelector((state: RootState) => state.CartDetail.ids);

  // Hàm thêm sản phẩm vào giỏ hàng
  const [isAddingToCart, setIsAddingToCart] = useState(false); // Cờ kiểm soát API

  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = async (
    productId: number | string | undefined,
    sizeId: number | string | undefined,
    colorId: number | string | undefined,
    quantities: number | string
  ) => {
    // Chuyển quantities thành số và kiểm tra tính hợp lệ
    quantities = Number(quantities);
    if (isNaN(quantities) || quantities <= 0) {
      // Nếu quantities không hợp lệ, gán giá trị mặc định (1)
      quantities = 1;
    }
    setCartItem({
      product_id: productId,
      color_id: colorId,
      size_id: sizeId,
      quantity: quantities,
    });

    setCart((prevCart: any) => {
      const existingProductIndex = prevCart.findIndex(
        (item: any) =>
          item.product_id === productId &&
          item.size_id === sizeId &&
          item.color_id === colorId
      );

      if (existingProductIndex >= 0) {
        // Nếu sản phẩm đã tồn tại trong giỏ, cộng thêm số lượng
        console.log(
          "Current quantity:",
          prevCart[existingProductIndex].quantity
        );
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += quantities;
        console.log(
          "Updated quantity:",
          updatedCart[existingProductIndex].quantity
        );
        return updatedCart;
      } else {
        // Nếu sản phẩm chưa có trong giỏ, thêm mới
        return [
          ...prevCart,
          {
            product_id: productId,
            color_id: colorId,
            size_id: sizeId,
            quantity: quantities,
          },
        ];
      }
    });
    setIsAddingToCart(true); // Đánh dấu cần gọi API
    message.success("Thêm vào giỏ hàng thành công!");
  };

  useEffect(() => {
    if (!isAddingToCart) return; // Chỉ gọi API nếu flag isAddingToCart là true

    const addProductToCart = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/cart/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          // body: JSON.stringify(cart[cart.length - 1]),
          body: JSON.stringify(cartItem),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("API Error:", errorData);
          return;
        }

        console.log("Product added to cart:", cart[cart.length - 1]);
      } catch (error) {
        console.error("Failed to add product to cart:", error);
      } finally {
        setIsAddingToCart(false); // Reset flag để ngăn chặn API gọi lại
      }
    };

    addProductToCart();
    dispatch(setQuantityCart(cart.length));
  }, [cart, isAddingToCart]);

  useEffect(() => {
    dispatch(setQuantityCart(cart.length));
  }, [cart, dispatch]);
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
        // console.log(result.data.cart_details);
        if (result && result.status && result.data) {
          // Kiểm tra xem API có trả về mảng sản phẩm không
          if (
            result.data.cart_details &&
            Array.isArray(result.data.cart_details)
          ) {
            setCart(result.data.cart_details); // Set giỏ hàng với danh sách sản phẩm
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

  const [userName, setUserName] = useState<string | null>(null);

  const updateUserName = (name: string) => {
    setUserName(name);
  };

  return (
    <Router>
      <Routes>
        <Route path="" element={<Layout q={cart.length} />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route
            path="products/:id"
            element={<ProductDetail addToCart={addToCart} />}
          />
          <Route path="carts" element={<Carts />} />
          <Route path="category" element={<CategoryPage />} />
          <Route path="register" element={<Register />} />
          <Route
            path="login"
            element={<Login updateUserName={updateUserName} />}
          />
          <Route path="verify" element={<EmailVerify />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="payments" element={<PaymentPage />} />
          <Route path="ordersuccess" element={<OrderSuccess />} />
          <Route path="404" element={<NotFound />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/order-detail" element={<OrderDetail />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/update-password" element={<UpdatePass />} />
          <Route path="/adrress" element={<Adrress />} />
        </Route>

        {/* Route cho phần admin */}
        <Route path="login" element={<LoginAdmin />} />
        <Route path="register" element={<RegisterAdmin />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="categories" element={<Categories />} />
          <Route path="promotions" element={<Promotions />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="statistics" element={<Statistics  />} />
          <Route path="reviews" element={<Review />} />
          <Route path="product-variants" element={<ProductVariants />} />
          <Route path="products" element={<Product />} />
          <Route path="orders" element={<Orders />} />

          <Route path="users" element={<User />} />
          
          

        </Route>
      </Routes>
    </Router>
  );
};

export default App;
