import React from "react";
import { Link } from "react-router-dom";
import { AppDispatch } from "../store/store";
import { RootState } from "../store/store";
import { addToFavorites, removeFromFavorites } from "../store/favoriteSlice";
import { useDispatch, useSelector } from "react-redux";
import Heart from "./Heart";

type Props = {
  id: number;
  name: string;
  price: string;
  image: { image_url: string };
};

const ProductItem = (props: Props) => {
  const { id, name, price, image } = props;
  const dispatch = useDispatch<AppDispatch>();

  const favoriteItems = useSelector(
    (state: RootState) => state.favorites.items
  );
  const isFavorite = favoriteItems.includes(id.toString());

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(id.toString()));
    } else {
      dispatch(addToFavorites(id.toString()));
    }
  };

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
              Mua Ngay{" "}
            </a>
          </div>
        </Link>
        <div className="block2-txt flex-w flex-t p-t-14">
          <div className="block2-txt-child1 flex-col-l">
            <a href="" className="stext-104 cl4 hov-cl1 trans-04">
              {name}
            </a>

            <span className="stext-105 cl3">{price.toLocaleString()}₫</span>
          </div>

          <div className="block2-txt-child2 flex-r p-t-3">
            <Heart product_id={id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
