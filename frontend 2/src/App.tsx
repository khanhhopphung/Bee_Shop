import React from "react";
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
import Categories from "./pages/admin/Categories"; // Đảm bảo chỉ có một dòng import này cho Categories
import Review from "./pages/admin/Review"; // Đảm bảo chỉ có một dòng import này cho Review
import ProductVariants from "./pages/admin/ProductVariant";
import Product from "./pages/admin/Product";
import Orders from "./pages/admin/Order";


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/carts" element={<Carts />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<EmailVerify />} />
        <Route path="/blogs" element={<Blogs />} />

        {/* Route cho phần admin */}
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/admin/register" element={<RegisterAdmin />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="categories" element={<Categories />} />
          <Route path="reviews" element={<Review />} />
          <Route path="product-variants" element={<ProductVariants />} />
          <Route path="products" element={<Product />} />
          <Route path="orders" element={<Orders />} />
        </Route>
        
      </Routes>
    </Router>
  );
};

export default App;
