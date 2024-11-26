import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn lên đầu trang mỗi khi route thay đổi
  }, [pathname]); // Kích hoạt khi pathname thay đổi

  return null; // Không cần render gì
};

export default ScrollToTop;
