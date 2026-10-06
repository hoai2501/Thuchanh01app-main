import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type {
  Deadline,
} from "../../types/deadline";

import {
  isDeadline,
} from "../../types/deadline";
import { fetchDeadlineApi } from "./deadlineApi";

/* =========================================
   LOCAL STORAGE KEY
========================================= */

const STORAGE_KEY =
  "student-deadline-tracker";

/* =========================================
   STATE
========================================= */

interface DeadlineState {
  items: Deadline[];
  loading: boolean;
  error: string | null;
}

const initialState: DeadlineState = {
  items: [],
  loading: false,
  error: null,
};

/* =========================================
   LOAD DATA
========================================= */

export const fetchDeadlines =
  createAsyncThunk(
    "deadlines/fetchDeadlines",

    async () => {
      /*
       Kiểm tra LocalStorage trước
      */

      const savedData =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (savedData) {
        try {
          const parsedData =
            JSON.parse(savedData);

          /*
           Kiểm tra dữ liệu bằng Type Guard
          */

          if (
            Array.isArray(parsedData)
          ) {
            const validData =
              parsedData.filter(
                isDeadline
              );

            if (
              validData.length > 0
            ) {
              console.log(
                "💾 Lấy dữ liệu từ LocalStorage"
              );

              return validData;
            }
          }
        } catch (error) {
          console.error(
            "LocalStorage không hợp lệ:",
            error
          );
        }
      }

      /*
       Nếu chưa có LocalStorage
       → gọi Mock API
      */

      console.log(
        "🌐 Chưa có dữ liệu → gọi Mock API"
      );

      const responseData = await fetchDeadlineApi();

      /*
       Lưu dữ liệu API vào LocalStorage
      */

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          responseData
        )
      );

      return responseData.filter(isDeadline);
    }
  );

/* =========================================
   SLICE
========================================= */

const deadlineSlice = createSlice({
  name: "deadlines",

  initialState,

  reducers: {
    /* =====================================
       ADD
    ===================================== */

    addDeadline: (
      state,
      action: PayloadAction<Deadline>
    ) => {
      state.items.push(
        action.payload
      );

      /*
       Lưu lại LocalStorage
      */

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          state.items
        )
      );
    },

    replaceDeadlines: (
      state,
      action: PayloadAction<Deadline[]>
    ) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },

    /* =====================================
       TOGGLE
    ===================================== */

    toggleDeadline: (
      state,
      action: PayloadAction<number>
    ) => {
      const deadline =
        state.items.find(
          (item) =>
            item.id ===
            action.payload
        );

      if (deadline) {
        deadline.completed =
          !deadline.completed;

        /*
         Lưu lại LocalStorage
        */

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(
            state.items
          )
        );
      }
    },

    /* =====================================
       DELETE
    ===================================== */

    deleteDeadline: (
      state,
      action: PayloadAction<number>
    ) => {
      state.items =
        state.items.filter(
          (item) =>
            item.id !==
            action.payload
        );

      /*
       Lưu lại LocalStorage
      */

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          state.items
        )
      );
    },
  },

  /* =====================================
     ASYNC STATES
  ===================================== */

  extraReducers: (builder) => {
    builder

      .addCase(
        fetchDeadlines.pending,
        (state) => {
          state.loading = true;

          state.error = null;
        }
      )

      .addCase(
        fetchDeadlines.fulfilled,
        (
          state,
          action
        ) => {
          state.loading = false;

          state.items =
            action.payload;
        }
      )

      .addCase(
        fetchDeadlines.rejected,
        (state) => {
          state.loading = false;

          state.error =
            "Không thể lấy dữ liệu";
        }
      );
  },
});

/* =========================================
   EXPORT ACTIONS
========================================= */

export const {
  addDeadline,
  replaceDeadlines,
  toggleDeadline,
  deleteDeadline,
} = deadlineSlice.actions;

/* =========================================
   EXPORT REDUCER
========================================= */

export default deadlineSlice.reducer;