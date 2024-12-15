import React from "react";

type Props = {};

const Footer = (props: Props) => {
  return (
    <div>
      <footer className="bg3 p-t-75 p-b-32">
        <div className="container">
          <div className="row">
            <div
              className="col-sm-6 col-lg-3 p-b-50"
              // style={{ backgroundColor: "red" }}
            >
              <img
                src="images/BeeShopp.png"
                width={"250px"}
                alt="logo"
                style={{ marginTop: "-70px", marginLeft: "-40px" }}
              />
              {/* <p>BeeShop</p> */}
            </div>
            <div className="col-sm-6 col-lg-3 p-b-50">
              <h4 className="stext-301 cl0 p-b-30">Trợ giúp</h4>
              <ul>
                <li className="p-b-10">
                  <a href="#" className="stext-107 cl7 hov-cl1 trans-04">
                    FAQ
                  </a>
                </li>
                <li className="p-b-10">
                  <a
                    href="/privacy-policy"
                    className="stext-107 cl7 hov-cl1 trans-04"
                  >
                    Chính sách bảo mật
                  </a>
                </li>
                <li className="p-b-10">
                  <a
                    href="/shipping-policy"
                    className="stext-107 cl7 hov-cl1 trans-04"
                  >
                    Chính sách giao hàng
                  </a>
                </li>
                <li className="p-b-10">
                  <a
                    href="/return-policy"
                    className="stext-107 cl7 hov-cl1 trans-04"
                  >
                    Chính sách đổi trả và hoàn tiền
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-sm-6 col-lg-3 p-b-50">
              <h4 className="stext-301 cl0 p-b-30">Về Bee Shop</h4>
              <a href="#" className="stext-107 cl7 hov-cl1 trans-04">
                Thông tin
              </a>
              <div className="p-t-27" style={{ marginTop: "-20px" }}>
                <a
                  href="https://www.facebook.com/profile.php?id=61569659241755"
                  className="fs-18 cl7 hov-cl1 trans-04 m-r-16"
                >
                  <i className="fa fa-facebook" />
                </a>
                <a href="#" className="fs-18 cl7 hov-cl1 trans-04 m-r-16">
                  <i className="fa fa-instagram" />
                </a>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3 p-b-50">
              <h4 className="stext-301 cl0 p-b-30">Bản Tin</h4>
              <form>
                <div className="wrap-input1 w-full p-b-4">
                  <input
                    className="input1 bg-none plh1 stext-107 cl7"
                    type="text"
                    name="email"
                    placeholder="email@example.com"
                  />
                  <div className="focus-input1 trans-04" />
                </div>
                <div className="p-t-18">
                  <button className="flex-c-m stext-101 cl0 size-103 bg1 bor1 hov-btn2 p-lr-15 trans-04">
                    Đăng Ký
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
