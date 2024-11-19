import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface List {}

const FavoriteList: React.FC = () => {
  const favoriteItems = useSelector(
    (state: RootState) => state.favorites.items
  );
  const [list, setList] = useState();
  const fetchGet = async () => {
    const response = await fetch(`http://127.0.0.1:8000/api/wishlist`, {
      // Thay đổi URL API của bạn
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Thay đ��i token của bạn
      },
    });
  };

  useEffect(() => {
    fetchGet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h2>Danh sách yêu thích</h2>
      {favoriteItems.length === 0 ? (
        <p>Chưa có sản phẩm yêu thích nào</p>
      ) : (
        <ul>
          {favoriteItems.map(
            (
              id: string // Thêm kiểu cho id
            ) => (
              <li key={id}>{id}</li> // Bạn có thể hiển thị thông tin sản phẩm đầy đủ hơn
            )
          )}
        </ul>
      )}
    </div>
  );
};

export default FavoriteList;
