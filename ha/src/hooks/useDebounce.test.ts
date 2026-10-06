import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns the new value after the debounce delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "old" } }
    );

    rerender({ value: "new" });
    expect(result.current).toBe("old");

    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(result.current).toBe("old");

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe("new");
  });
});
