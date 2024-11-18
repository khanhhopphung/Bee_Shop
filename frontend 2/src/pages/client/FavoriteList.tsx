import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const FavoriteList: React.FC = () => {
  const favoriteItems = useSelector(
    (state: RootState) => state.favorites.items
  );

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
