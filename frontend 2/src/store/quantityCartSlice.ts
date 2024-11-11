import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface QuantityCart {
  quantity: number;
}
const initialState: QuantityCart = {
  quantity: 0,
};
const QuantityCart = createSlice({
  name: "quantity",
  initialState,
  reducers: {
    setQuantityCart: (state, action: PayloadAction<number>) => {
      state.quantity = action.payload;
    },
  },
});
export const { setQuantityCart } = QuantityCart.actions;
export default QuantityCart.reducer;
