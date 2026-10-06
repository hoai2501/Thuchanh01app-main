
import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";

import cartReducer from "../features/cart/cartSlice";
import deadlineReducer from "../features/deadlines/deadlineSlice";

const logger = createLogger({
  collapsed: true,
  duration: true,
  predicate: (_state, action) =>
    action.type !== "deadlines/replaceDeadlines",
});

export const store = configureStore({
  reducer: {
    deadlines: deadlineReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    import.meta.env.DEV
      ? getDefaultMiddleware().concat(logger)
      : getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
