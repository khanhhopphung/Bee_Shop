import React from "react";
import { Link } from "react-router-dom";

type Props = {
  id: number;
  name: string;
  price: string;
  image: { image_url: string };
};

const ProductItem = (props: Props) => {
  const { id, name, price, image } = props;

  // console.log(image);
  return (
    <div className="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item">
      {/* <>{console.log(image.image_url)}</> */}
      <div className="block2">
        <Link to={`/products/${id}`}>
          <div className="block2-pic hov-img0">
            <img
              src={`http://127.0.0.1:8000/storage/${image.image_url}`}
              alt={`Product: ${name}`}
            />
            <a
              href="#"
              className="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04"
            >
              Xem nhanh
            </a>
          </div>
        </Link>
        <div className="block2-txt flex-w flex-t p-t-14">
          <div className="block2-txt-child1 flex-col-l">
            <a href="" className="stext-104 cl4 hov-cl1 trans-04">
              {name}
            </a>

            <span className="stext-105 cl3">{price}</span>
          </div>
          <div className="block2-txt-child2 flex-r p-t-3">
            <a
              href="#"
              className="btn-addwish-b2 dis-block pos-relative js-addwish-b2"
            >
              <img
                className="icon-heart1 dis-block trans-04"
                src="images/icons/icon-heart-01.png"
                alt="ICON"
              />
              <img
                className="icon-heart2 dis-block trans-04 ab-t-l"
                src="images/icons/icon-heart-02.png"
                alt="ICON"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
