import { afterEach, describe, expect, it, jest } from "@jest/globals";

import { fetchDeadlineApi } from "./deadlineApi";

describe("deadline API", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns the mock assignments after the request delay", async () => {
    jest.useFakeTimers();

    const response = fetchDeadlineApi();
    await jest.advanceTimersByTimeAsync(300);

    const assignments = await response;
    expect(assignments).toHaveLength(4);
    expect(assignments[0].title).toBe("Bài tập React");
  });
});
