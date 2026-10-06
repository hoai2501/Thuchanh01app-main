import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface PinState {
  pinnedIds: number[];
  togglePin: (id: number) => void;
  isPinned: (id: number) => boolean;
}

export const usePinStore = create<PinState>()(
  persist(
    (set, get) => ({
      pinnedIds: [],
      togglePin: (id: number) => {
        const currentPinnedIds = get().pinnedIds;
        const isAlreadyPinned = currentPinnedIds.includes(id);

        set({
          pinnedIds: isAlreadyPinned
            ? currentPinnedIds.filter((pinnedId) => pinnedId !== id)
            : [...currentPinnedIds, id],
        });
      },
      isPinned: (id: number) => get().pinnedIds.includes(id),
    }),
    {
      name: "student-deadline-pins",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ pinnedIds: state.pinnedIds }),
    }
  )
);
