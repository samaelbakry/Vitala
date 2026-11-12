import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import authSlice from "../features/auth/authSlice";
import uiReducer from "../components/ui/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export const useAppSelector = useSelector.withTypes<RootState>();
