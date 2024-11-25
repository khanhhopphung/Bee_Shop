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
//admin
import Categories from "./pages/admin/Categories"; 
import Promotions from './pages/admin/Promotions';
import AdminBlogs from './pages/admin/Blogs';
import Statistics from "./pages/admin/Statistics";





interface CartItem {
  product_id: any;
  color_id: any;
  size_id: any;
  quantity: any;
  discount_value?: any;
}

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const dispatch = useDispatch();

  const token = localStorage.getItem("access_token");

  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = async (
    productId: number | string | undefined,
    sizeId: number | string | undefined,
    colorId: number | string | undefined,
    quantities: number | string
  ) => {
    setCart((prevCart: any) => {
      const existingProductIndex = prevCart.findIndex(
        (item: any) =>
          item.product_id === productId &&
          item.size_id === sizeId &&
          item.color_id === colorId
      );

      if (existingProductIndex >= 0) {
        // Tăng số lượng nếu sản phẩm đã có
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += quantities;
        return updatedCart;
      } else {
        // Thêm sản phẩm mới vào giỏ hàng
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
    message.success("Thêm vào giỏ hàng thành công!");
  };

  // Gọi API sau khi cart được cập nhật
  useEffect(() => {
    if (cart.length === 0) return;

    const addProductToCart = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/cart/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cart[cart.length - 1]), // Gửi sản phẩm mới được thêm vào
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("API Error:", errorData);
          return;
        }

        console.log("Product added to cart:", cart[cart.length - 1]);
      } catch (error) {
        console.error("Failed to add product to cart:", error);
      }
    };
    dispatch(setQuantityCart(cart.length));

    addProductToCart();
  }, [cart]);

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
        console.log(result.data.cart_details);
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
        </Route>

        {/* Route cho phần admin */}
        <Route path="login" element={<LoginAdmin />} />
        <Route path="register" element={<RegisterAdmin />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="categories" element={<Categories />} />
          <Route path="promotions" element={<Promotions />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="statistics" element={<Statistics />} />

        </Route>
      </Routes>
    </Router>
  );
};

export default App;
