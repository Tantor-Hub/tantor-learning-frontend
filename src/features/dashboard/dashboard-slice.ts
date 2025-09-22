import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DashboardState {
  selectedSessionId: string | null;
}

const initialState: DashboardState = {
  selectedSessionId: null,
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setSelectedSessionId: (state, action: PayloadAction<string | null>) => {
      state.selectedSessionId = action.payload;
    },
    clearSelectedSessionId: (state) => {
      state.selectedSessionId = null;
    },
  },
});

export const { setSelectedSessionId, clearSelectedSessionId } = dashboardSlice.actions;
export const selectSelectedSessionId = (state: any) => state.dashboard.selectedSessionId;
export default dashboardSlice.reducer;
