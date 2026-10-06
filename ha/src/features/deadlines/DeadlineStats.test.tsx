import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "@jest/globals";

import type { Deadline } from "../../types/deadline";
import { DeadlineStatsPage } from "./DeadlineStats";

describe("DeadlineStats", () => {
  it("renders completion, overdue and subject totals", () => {
    const deadlines: Deadline[] = [
      {
        id: 1,
        subject: "Web",
        title: "Past work",
        dueDate: "2026-10-01",
        priority: "High",
        completed: false,
      },
      {
        id: 2,
        subject: "Database",
        title: "Done work",
        dueDate: "2026-10-20",
        priority: "Low",
        completed: true,
      },
    ];

    render(<DeadlineStatsPage deadlines={deadlines} />);

    expect(screen.getByText("2", { selector: "strong" })).toBeTruthy();
    expect(screen.getByText("Web: 1")).toBeTruthy();
    expect(screen.getByText("Database: 1")).toBeTruthy();
  });
});
