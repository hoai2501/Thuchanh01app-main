import { describe, expect, it } from "@jest/globals";

import { calcDaysLeft, isOverdue } from "../../hooks/useDeadline";
import { calcStats } from "./calculateDeadlineStats";
import type { Deadline } from "../../types/deadline";

const fixedToday = new Date("2026-10-06T12:00:00");
const baseDeadline: Deadline = {
  id: 1,
  subject: "Web",
  title: "Build page",
  dueDate: "2026-10-05",
  priority: "High",
  completed: false,
};

describe("deadline utility functions", () => {
  it("detects a past due deadline", () => {
    expect(isOverdue(baseDeadline, fixedToday)).toBe(true);
  });

  it("does not report completed past work as overdue", () => {
    expect(
      isOverdue({ ...baseDeadline, completed: true }, fixedToday)
    ).toBe(false);
  });

  it("calculates days remaining across dates", () => {
    expect(calcDaysLeft("2026-10-09", fixedToday)).toBe(3);
  });

  it("returns zero on the due date", () => {
    expect(calcDaysLeft("2026-10-06", fixedToday)).toBe(0);
  });

  it("counts completion, overdue work and items grouped by subject", () => {
    const stats = calcStats(
      [
        baseDeadline,
        { ...baseDeadline, id: 2, completed: true },
        { ...baseDeadline, id: 3, subject: "DB", dueDate: "2026-10-10" },
      ],
      fixedToday
    );

    expect(stats).toEqual({
      total: 3,
      completed: 1,
      overdue: 1,
      bySubject: { Web: 2, DB: 1 },
    });
  });
});
