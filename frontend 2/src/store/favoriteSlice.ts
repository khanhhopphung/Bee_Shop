// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface Favorite {
//   items: string[]; // Lưu các ID của sản phẩm yêu thích
// }

// const initialState: Favorite = {
//   items: [],
// };

// const favoriteSlice = createSlice({
//   name: "favorites",
//   initialState,
//   reducers: {
//     addToFavorites: (state, action: PayloadAction<string>) => {
//       if (!state.items.includes(action.payload)) {
//         state.items.push(action.payload);
//       }
//     },
//     removeFromFavorites: (state, action: PayloadAction<string>) => {
//       state.items = state.items.filter((id) => id !== action.payload);
//     },
//   },
// });

// export const { addToFavorites, removeFromFavorites } = favoriteSlice.actions;
// export default favoriteSlice.reducer;
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface QuantityFavorites {
  quantity: number;
}
const initialState = {
  items: JSON.parse(localStorage.getItem("favorites") || "[]"), // Lấy danh sách yêu thích từ localStorage
  quantity: 0,
};

const favoriteSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addToFavorites: (state, action) => {
      state.items = action.payload; // Cập nhật danh sách yêu thích
    },
    removeFromFavorites: (state, action) => {
      state.items = state.items.filter((id: string) => id !== action.payload); // Xóa mục khỏi danh sách yêu thích
    },
    setquantityFavorites: (state, action: PayloadAction<number>) => {
      state.quantity = action.payload;
    },
  },
});

export const { addToFavorites, removeFromFavorites, setquantityFavorites } =
  favoriteSlice.actions;
export default favoriteSlice.reducer;
