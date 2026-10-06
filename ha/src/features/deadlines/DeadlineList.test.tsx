import { configureStore } from "@reduxjs/toolkit";
import { act, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { usePinStore } from "../../usePinStore";
import type { Deadline } from "../../types/deadline";
import DeadlineList from "./DeadlineList";
import reducer, { fetchDeadlines } from "./deadlineSlice";
import { fetchDeadlineApi } from "./deadlineApi";

jest.mock("./deadlineApi", () => ({
  fetchDeadlineApi: jest.fn(),
}));

const sample: Deadline = {
  id: 41,
  subject: "Kiểm thử",
  title: "Bài async",
  dueDate: "2026-10-20",
  priority: "Low",
  completed: false,
};

function setup() {
  const store = configureStore({
    reducer: { deadlines: reducer },
  });
  const view = render(
    <Provider store={store}>
      <DeadlineList filter="all" />
    </Provider>
  );
  return { store, ...view };
}

describe("DeadlineList asynchronous API states", () => {
  beforeEach(() => {
    localStorage.clear();
    usePinStore.setState({ pinnedIds: [] });
    jest.clearAllMocks();
  });

  it("shows a loading state while the mocked API is pending", () => {
    jest.mocked(fetchDeadlineApi).mockReturnValue(
      new Promise<Deadline[]>(() => {})
    );
    const { store } = setup();

    act(() => {
      void store.dispatch(fetchDeadlines());
    });

    expect(screen.getByText("Đang tải dữ liệu...")).toBeTruthy();
  });

  it("renders assignments when the mocked API succeeds", async () => {
    jest.mocked(fetchDeadlineApi).mockResolvedValue([sample]);
    const { store } = setup();

    await act(async () => {
      await store.dispatch(fetchDeadlines());
    });

    expect(await screen.findByText("Bài async")).toBeTruthy();
  });

  it("shows an error when the mocked API fails", async () => {
    jest.mocked(fetchDeadlineApi).mockRejectedValue(new Error("offline"));
    const { store } = setup();

    await act(async () => {
      await store.dispatch(fetchDeadlines());
    });

    await waitFor(() => {
      expect(screen.getByText(/Không thể lấy dữ liệu/)).toBeTruthy();
    });
  });
});
