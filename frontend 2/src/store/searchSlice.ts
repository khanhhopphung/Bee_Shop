import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Search {
  key: string;
}
const initialState: Search = {
  key: "",
};
const searchSlice = createSlice({
  name: "key",
  initialState,
  reducers: {
    setSearchRedux: (state, action: PayloadAction<string>) => {
      state.key = action.payload;
    },
  },
});
export const { setSearchRedux } = searchSlice.actions;
export default searchSlice.reducer;
