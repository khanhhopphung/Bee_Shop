import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToFavorites } from "../store/favoriteSlice";
import { RootState } from "../store/store";

interface Props {
  product_id: string;
}

const Heart: React.FC<Props> = ({ product_id }) => {
  const dispatch = useDispatch();
  const ids = useSelector((state: RootState) => state.favorites.items);
  const token = localStorage.getItem("access_token");

  // Local state để kiểm soát trạng thái yêu thích
  const [isFavorite, setIsFavorite] = useState(false);

  // Kiểm tra trạng thái yêu thích khi component được render lần đầu
  useEffect(() => {
    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setIsFavorite(storedFavorites.includes(product_id));
  }, [product_id]);

  const toggleHeart = (id: string) => {
    const updatedFavorites = [...ids]; // Bắt đầu từ danh sách hiện tại
    const addFavorite = async (id: number) => {
      const res = await fetch("http://127.0.0.1:8000/api/wishlist", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify({ id }),
      });
    };

    const removeFavorite = async (id: number) => {
      const res = await fetch("http://127.0.0.1:8000/api/wishlist", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
    };

    if (isFavorite) {
      // Nếu đã yêu thích, xóa khỏi danh sách
      const index = updatedFavorites.indexOf(id);
      if (index > -1) updatedFavorites.splice(index, 1);
      console.log("xóa");
      // addFavorite(Number(id));
    } else {
      // Nếu chưa yêu thích, thêm vào danh sách
      updatedFavorites.push(id);
      // removeFavorite(Number(id));
      console.log("thêm");
    }

    // Cập nhật Redux state và localStorage
    dispatch(addToFavorites(id));
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

    // Cập nhật trạng thái local
    setIsFavorite(!isFavorite);
  };

  useEffect(() => {
    console.log("Danh sách yêu thích:", ids);
  }, [ids]);

  return (
    <div>
      <div className="block2-txt-child2 flex-r p-t-3">
        <a
          href="#"
          className={`btn-addwish-b2 dis-block pos-relative ${
            isFavorite ? "js-addedwish-b2" : ""
          }`}
          onClick={(e) => {
            e.preventDefault(); // Ngăn việc reload trang
            toggleHeart(product_id);
          }}
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
  );
};

export default Heart;
