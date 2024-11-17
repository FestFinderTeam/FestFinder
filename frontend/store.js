import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import apiResponseMiddleware from "@/middleware/apiResponseMiddleware";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, apiResponseMiddleware),
});

export default store;
