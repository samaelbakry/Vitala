
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type Theme = "light" | "dark";

type UIState = {
  sidebarOpen: boolean;
  theme: Theme;
};

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "light";

  const savedTheme = localStorage.getItem("vitala-theme");

  return savedTheme === "dark" ? "dark" : "light";
};

const initialState: UIState = {
  sidebarOpen: true,
  theme: getInitialTheme(),
};

const uiSlice = createSlice({
  name: "ui",
  initialState,

  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },

    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },

    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  toggleTheme,
} = uiSlice.actions;

export default uiSlice.reducer;
