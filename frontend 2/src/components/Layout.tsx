// src/components/Layout/Layout.tsx
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

interface LayoutProps {
  children?: React.ReactNode;
  q: number;
}

const Layout: React.FC<LayoutProps> = ({ q }) => {
  return (
    <div>
      <Header quantity={q} />
      {/* <p>{q}</p> */}
      {/* <main>{children}</main> */}
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
