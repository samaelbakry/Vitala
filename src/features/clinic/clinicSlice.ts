
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ClinicState {
  activeClinicId: string | null;
}

const initialState: ClinicState = {
  activeClinicId: null,
};

const clinicSlice = createSlice({
  name: "clinic",
  initialState,
  reducers: {
    setActiveClinic: ( state,action: PayloadAction<string>) => {
      state.activeClinicId = action.payload;
    },

    clearActiveClinic: (state) => {
      state.activeClinicId = null;
    },
  },
});

export const {
  setActiveClinic,
  clearActiveClinic,
} = clinicSlice.actions;

export default clinicSlice.reducer;
