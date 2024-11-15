// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import QuantityCart from "../../src/store/quantityCartSlice";
// Import các slice reducer của bạn tại đây, ví dụ như userSlice hoặc cartSlice

const store = configureStore({
  reducer: {
    // Thêm các slice reducer tại đây, ví dụ: user: userSlice.reducer
    quantity: QuantityCart,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
