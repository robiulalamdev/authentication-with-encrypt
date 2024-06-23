import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api/apiSlice";
import usersReducer from "./features/users/usersSlice";

const store = configureStore({
  reducer: {
    user: usersReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;
