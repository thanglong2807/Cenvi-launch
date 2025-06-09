// src/redux/store.ts

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import blogReducer from "./slices/blogSlice";
import productsReducer from "./slices/productsSlice";
import categoriesReducer from "./slices/categoriesSlice";
import customersReducer from "./slices/customersSlice";
import employeesReducer from "./slices/employeesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    blogs: blogReducer,
    products: productsReducer,
    categories: categoriesReducer,
    customers: customersReducer,
    employees: employeesReducer,
  },
});

// Optional types for useSelector and useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
