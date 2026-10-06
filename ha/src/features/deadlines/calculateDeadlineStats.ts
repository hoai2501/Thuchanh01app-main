import type { Deadline } from "../../types/deadline";
import { isOverdue } from "../../hooks/useDeadline";

export interface DeadlineStats {
  total: number;
  completed: number;
  overdue: number;
  bySubject: Record<string, number>;
}

export function calcStats(
  deadlines: Deadline[],
  today = new Date()
): DeadlineStats {
  return deadlines.reduce<DeadlineStats>(
    (stats, deadline) => {
      stats.total += 1;
      if (deadline.completed) {
        stats.completed += 1;
      }
      if (isOverdue(deadline, today)) {
        stats.overdue += 1;
      }
      stats.bySubject[deadline.subject] =
        (stats.bySubject[deadline.subject] ?? 0) + 1;
      return stats;
    },
    { total: 0, completed: 0, overdue: 0, bySubject: {} }
  );
}
