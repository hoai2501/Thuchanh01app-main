import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Provider } from "react-redux";

import deadlineReducer from "./deadlineSlice";
import AssignmentCard from "./AssignmentCard";
import DeadlineForm from "./DeadlineForm";
import type { Deadline } from "../../types/deadline";
import { usePinStore } from "../../usePinStore";

const item: Deadline = {
  id: 31,
  subject: "Lập trình Web",
  title: "Xây dựng giao diện",
  dueDate: "2026-10-20",
  priority: "High",
  completed: false,
};

function makeStore() {
  return configureStore({
    reducer: { deadlines: deadlineReducer },
    preloadedState: {
      deadlines: { items: [item], loading: false, error: null },
    },
  });
}

function renderWithStore(element: React.ReactElement) {
  const store = makeStore();
  return {
    store,
    ...render(<Provider store={store}>{element}</Provider>),
  };
}

describe("AssignmentCard", () => {
  beforeEach(() => {
    localStorage.clear();
    usePinStore.setState({ pinnedIds: [] });
  });

  it("renders assignment details", () => {
    renderWithStore(<AssignmentCard deadline={item} />);

    expect(screen.getByText("Xây dựng giao diện")).toBeTruthy();
    expect(screen.getByText("Lập trình Web")).toBeTruthy();
  });

  it("dispatches completion toggle", async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(<AssignmentCard deadline={item} />);

    await user.click(screen.getByRole("button", { name: "Hoàn thành" }));

    expect(store.getState().deadlines.items[0].completed).toBe(true);
  });

  it("toggles the pin state", async () => {
    const user = userEvent.setup();
    renderWithStore(<AssignmentCard deadline={item} />);

    await user.click(screen.getByRole("button", { name: "Ghim bài tập" }));

    expect(usePinStore.getState().isPinned(item.id)).toBe(true);
    expect(screen.getByRole("button", { name: "Bỏ ghim bài tập" }))
      .toBeTruthy();
  });
});

describe("DeadlineForm", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("validates required fields and does not create an assignment", async () => {
    const user = userEvent.setup();
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    const { store } = renderWithStore(<DeadlineForm />);

    await user.click(screen.getByRole("button", { name: /Thêm deadline/ }));
    await user.click(screen.getAllByRole("button", { name: /Thêm deadline/ }).at(-1)!);

    expect(alertSpy).toHaveBeenCalledWith("Vui lòng nhập đầy đủ thông tin");
    expect(store.getState().deadlines.items).toHaveLength(1);
    alertSpy.mockRestore();
  });

  it("submits valid data to the Redux slice", async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(<DeadlineForm />);

    await user.click(screen.getByRole("button", { name: /Thêm deadline/ }));
    await user.type(
      screen.getByPlaceholderText("Ví dụ: Lập trình Web nâng cao"),
      "Mạng máy tính"
    );
    await user.type(
      screen.getByPlaceholderText("Ví dụ: Xây dựng ứng dụng Redux Toolkit"),
      "Bài lab"
    );
    await user.type(screen.getByLabelText(/Hạn nộp/), "2026-10-20");
    await user.click(screen.getAllByRole("button", { name: /Thêm deadline/ }).at(-1)!);

    expect(store.getState().deadlines.items).toHaveLength(2);
    expect(store.getState().deadlines.items[1]).toMatchObject({
      subject: "Mạng máy tính",
      title: "Bài lab",
      completed: false,
    });
  });
});
