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

// import Header from './components/Header';
// import Footer from './components/Footer';

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
      </Routes>
    </Router>
  );
};

export default App;
