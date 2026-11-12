import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Session, User } from "@supabase/supabase-js";

type AuthSlice = {
  user: User | null;
  session: Session | null;
  isInitialized: boolean;
};

const initialState: AuthSlice = {
  user: null,
  session: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<Session | null>) => {
      state.session = action.payload;
      state.user = action.payload?.user ?? null;
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },

    clearAuth: (state) => {
      state.session = null;
      state.user = null;
      state.isInitialized = false
    },
  },
});

export const { setSession, setInitialized, clearAuth } = authSlice.actions;

export default authSlice.reducer;
