import { beforeEach, describe, expect, it } from "@jest/globals";

import { usePinStore } from "./usePinStore";

describe("usePinStore", () => {
  beforeEach(() => {
    localStorage.clear();
    usePinStore.persist.clearStorage();
    usePinStore.setState({ pinnedIds: [] });
  });

  it("toggles a pin and reports its state", () => {
    const { togglePin, isPinned } = usePinStore.getState();

    expect(isPinned(7)).toBe(false);
    togglePin(7);
    expect(isPinned(7)).toBe(true);
    togglePin(7);
    expect(isPinned(7)).toBe(false);
  });

  it("persists and restores pinned ids", async () => {
    usePinStore.getState().togglePin(12);
    const savedState = localStorage.getItem("student-deadline-pins");
    expect(savedState).not.toBeNull();

    usePinStore.setState({ pinnedIds: [] });
    localStorage.setItem("student-deadline-pins", savedState!);
    await usePinStore.persist.rehydrate();

    expect(usePinStore.getState().pinnedIds).toEqual([12]);
  });
});
