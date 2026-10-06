export type Priority = "Low" | "Medium" | "High";

export type DeadlineStatus =
  | "all"
  | "pending"
  | "overdue"
  | "completed";

export interface Deadline {
  id: number;
  subject: string;
  title: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
}

/* Generic */
export interface ApiResponse<T> {
  data: T;
  message: string;
}

/* Utility Type - Omit */
export type NewDeadline = Omit<
  Deadline,
  "id" | "completed"
>;

/* Type Guard */
export function isDeadline(
  value: unknown
): value is Deadline {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "number" &&
    typeof item.subject === "string" &&
    typeof item.title === "string" &&
    typeof item.dueDate === "string" &&
    (item.priority === "Low" ||
      item.priority === "Medium" ||
      item.priority === "High") &&
    typeof item.completed === "boolean"
  );
}