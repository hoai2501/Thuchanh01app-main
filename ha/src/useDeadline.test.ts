import { renderHook } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { beforeEach, describe, expect, it } from "@jest/globals";

import deadlineReducer from "./features/deadlines/deadlineSlice";
import { useDeadline } from "./hooks/useDeadline";
import type { Deadline } from "./types/deadline";
import { usePinStore } from "./usePinStore";

const mockItems: Deadline[] = [
  { id: 1, subject: "Math", title: "Exercise 1", dueDate: "2026-10-10", priority: "High", completed: false },
  { id: 2, subject: "Science", title: "Exercise 2", dueDate: "2026-10-04", priority: "Medium", completed: false },
  { id: 3, subject: "History", title: "Exercise 3", dueDate: "2026-10-02", priority: "Low", completed: true },
];

describe("useDeadline ordering", () => {
  beforeEach(() => {
    usePinStore.setState({ pinnedIds: [2] });
  });

  it("places pinned items before the rest", () => {
    const testStore = configureStore({
      reducer: { deadlines: deadlineReducer },
      preloadedState: {
        deadlines: { items: mockItems, loading: false, error: null },
      },
    });
    const wrapper = ({ children }: { children?: React.ReactNode }) =>
      React.createElement(Provider, { store: testStore, children });

    const { result } = renderHook(() => useDeadline("all"), { wrapper });

    expect(result.current.deadlines.map((item) => item.id)).toEqual([2, 3, 1]);
  });
});
