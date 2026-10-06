import { describe, expect, it } from "@jest/globals";

import reducer, {
  addDeadline,
  deleteDeadline,
  fetchDeadlines,
  replaceDeadlines,
  toggleDeadline,
} from "./deadlineSlice";
import type { Deadline } from "../../types/deadline";

const deadline: Deadline = {
  id: 21,
  subject: "Web",
  title: "Exercise",
  dueDate: "2026-10-20",
  priority: "Medium",
  completed: false,
};

const initialState = { items: [deadline], loading: false, error: null };

describe("deadline reducer", () => {
  it("adds a new deadline", () => {
    expect(reducer(initialState, addDeadline({ ...deadline, id: 22 })).items)
      .toHaveLength(2);
  });

  it("toggles completion for a matching id", () => {
    expect(reducer(initialState, toggleDeadline(21)).items[0].completed)
      .toBe(true);
  });

  it("does not change items when toggling an unknown id", () => {
    expect(reducer(initialState, toggleDeadline(999))).toEqual(initialState);
  });

  it("deletes a matching deadline", () => {
    expect(reducer(initialState, deleteDeadline(21)).items).toEqual([]);
  });

  it("replaces the list for a stress-test dataset", () => {
    const next = reducer(initialState, replaceDeadlines([deadline, { ...deadline, id: 22 }]));
    expect(next.items.map((item) => item.id)).toEqual([21, 22]);
  });

  it("updates loading and error states for async actions", () => {
    const pending = reducer(initialState, fetchDeadlines.pending("request"));
    expect(pending.loading).toBe(true);
    expect(pending.error).toBeNull();

    const fulfilled = reducer(
      pending,
      fetchDeadlines.fulfilled([deadline], "request")
    );
    expect(fulfilled.loading).toBe(false);
    expect(fulfilled.items).toEqual([deadline]);

    const rejected = reducer(pending, fetchDeadlines.rejected(
      new Error("offline"),
      "request"
    ));
    expect(rejected.loading).toBe(false);
    expect(rejected.error).toBe("Không thể lấy dữ liệu");
  });
});
