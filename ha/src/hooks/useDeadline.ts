
import { useMemo } from "react";

import { useAppSelector } from "../app/hooks";
import { usePinStore } from "../usePinStore";

import type {
  Deadline,
  DeadlineStatus,
} from "../types/deadline";

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

export function isOverdue(
  deadline: Pick<Deadline, "dueDate" | "completed">,
  today = new Date()
): boolean {
  return !deadline.completed && calcDaysLeft(deadline.dueDate, today) < 0;
}

export function calcDaysLeft(
  dueDate: string,
  today = new Date()
): number {
  const todayStart = new Date(today);
  const target = new Date(`${dueDate}T00:00:00`);

  todayStart.setHours(0, 0, 0, 0);

  return Math.ceil(
    (target.getTime() - todayStart.getTime()) / DAY_IN_MILLISECONDS
  );
}

// ================================
// CUSTOM HOOK
// ================================

export function useDeadline(
  filter: DeadlineStatus
) {
  const deadlines =
    useAppSelector(
      (state) => state.deadlines.items
    );

  const pinnedIds = usePinStore(
    (state) => state.pinnedIds
  );

  const filteredDeadlines =
    useMemo(() => {
      const today = new Date();

      today.setHours(
        0,
        0,
        0,
        0
      );

      const filtered = deadlines.filter((deadline) => {
        if (filter === "completed") {
          return deadline.completed;
        }

        if (filter === "all") {
          return true;
        }

        if (deadline.completed) {
          return false;
        }

        const dueDate = new Date(`${deadline.dueDate}T00:00:00`);

        if (filter === "pending") {
          return dueDate >= today;
        }

        return dueDate < today;
      });
      const pinnedIdSet = new Set(pinnedIds);

      return filtered
        .sort((a, b) => {
          const aPinned = pinnedIdSet.has(a.id);
          const bPinned = pinnedIdSet.has(b.id);

          if (aPinned !== bPinned) {
            return Number(bPinned) - Number(aPinned);
          }

          return a.dueDate.localeCompare(b.dueDate);
        });
    }, [deadlines, filter, pinnedIds]);

  return {
    deadlines: filteredDeadlines,
    total: deadlines.length,
  };
}

// ================================
// TÍNH SỐ NGÀY
// ================================

export function getRemainingDays(
  dueDate: string
): number {
  return calcDaysLeft(dueDate);
}
