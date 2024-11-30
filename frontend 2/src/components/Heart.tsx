import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToFavorites,
  removeFromFavorites,
  setquantityFavorites,
} from "../store/favoriteSlice";
import { RootState } from "../store/store";
import { message } from "antd";

interface Props {
  product_id: number;
}

const Heart: React.FC<Props> = ({ product_id }) => {
  if (!localStorage.getItem("favorites")) {
    localStorage.setItem("favorites", JSON.stringify([]));
  }

  const dispatch = useDispatch();
  const ids = useSelector((state: RootState) => state.favorites.items);
  const token = localStorage.getItem("access_token");
  const isFavorite = ids.includes(product_id);
  // console.log(ids.length);

  const toggleHeart = async (id: number) => {
    let updatedFavorites = [...ids];

    if (isFavorite) {
      // Xóa yêu thích
      updatedFavorites = updatedFavorites.filter((favId) => favId !== id);

      // Gửi request xóa
      await fetch(`http://127.0.0.1:8000/api/wishlist/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "DELETE",
      });
      dispatch(removeFromFavorites(id));
      dispatch(setquantityFavorites(ids.length));
      message.success("Đã xóa sản phẩm khỏi danh sách yêu thích!");
    } else {
      // Thêm yêu thích
      updatedFavorites.push(id);

      // Gửi request thêm
      await fetch("http://127.0.0.1:8000/api/wishlist", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify({ product_id: id }),
      });
      // dispatch(addToFavorites([...ids, id]));
      dispatch(setquantityFavorites(ids.length));

      message.success("Đã thêm sản phẩm vào danh sách yêu thích!");
    }

    // Cập nhật Redux và localStorage
    dispatch(addToFavorites(updatedFavorites));

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div>
      <div className="block2-txt-child2 flex-r p-t-3">
        <a
          href="#"
          className={`btn-addwish-b2 dis-block pos-relative ${
            isFavorite ? "js-addedwish-b2" : ""
          }`}
          onClick={(e) => {
            e.preventDefault();
            toggleHeart(product_id);
          }}
        >
          <img
            className="icon-heart1 dis-block trans-04"
            src="/images/icons/icon-heart-01.png"
            alt="ICON"
          />
          <img
            className="icon-heart2 dis-block trans-04 ab-t-l"
            src="/images/icons/icon-heart-02.png"
            alt="ICON"
          />
        </a>
      </div>
    </div>
  );
};

export default Heart;
