import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface cartDetail {
  ids: number[];
}
const initialState: cartDetail = {
  ids: [],
};
const CartDetail = createSlice({
  name: "CartDetail",
  initialState,
  reducers: {
    setCartDetailIds: (state, action: PayloadAction<number[]>) => {
      state.ids = action.payload;
    },
  },
});
export const { setCartDetailIds } = CartDetail.actions;
export default CartDetail.reducer;
