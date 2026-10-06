
import { memo, useCallback } from "react";
import {
  useAppDispatch,
} from "../../app/hooks";
import { usePinStore } from "../../usePinStore";
import { isDevelopment } from "../../app/environment";

import {
  toggleDeadline,
  deleteDeadline,
} from "./deadlineSlice";

import {
  getRemainingDays,
  isOverdue as checkOverdue,
} from "../../hooks/useDeadline";

import type {
  Deadline,
} from "../../types/deadline";

interface Props {
  deadline: Deadline;
}

function DeadlineItem({
  deadline,
}: Props) {
  if (isDevelopment) {
    console.count("[Profiler] AssignmentCard renders");
  }

  const dispatch =
    useAppDispatch();

  const isPinned = usePinStore(
    (state) => state.isPinned(deadline.id)
  );

  const togglePin = usePinStore(
    (state) => state.togglePin
  );

  const remainingDays = getRemainingDays(deadline.dueDate);

  const overdue = checkOverdue(deadline);
  const handleToggleComplete = useCallback(() => {
    dispatch(toggleDeadline(deadline.id));
  }, [deadline.id, dispatch]);
  const handleDelete = useCallback(() => {
    dispatch(deleteDeadline(deadline.id));
  }, [deadline.id, dispatch]);
  const handleTogglePin = useCallback(() => {
    togglePin(deadline.id);
  }, [deadline.id, togglePin]);

  return (
    <div
      className={`deadline-item ${
        deadline.completed
          ? "completed"
          : ""
      }`}
    >
      <div className="deadline-info">

        <div className="deadline-header">
          <h3>
            {deadline.title}
          </h3>

          <button
            type="button"
            className={`pin-button ${isPinned ? "active" : ""}`}
            onClick={handleTogglePin}
            aria-label={
              isPinned ? "Bỏ ghim bài tập" : "Ghim bài tập"
            }
          >
            {isPinned ? "📌" : "📍"}
          </button>
        </div>

        <p>
          <strong>
            Môn học:
          </strong>{" "}
          {deadline.subject}
        </p>

        <p>
          <strong>
            Hạn nộp:
          </strong>{" "}
          {deadline.dueDate}
        </p>

        <p>
          <strong>
            Ưu tiên:
          </strong>{" "}

          <span
            className={`priority ${deadline.priority.toLowerCase()}`}
          >
            {deadline.priority}
          </span>
        </p>

        {!deadline.completed && (
          <p
            className={
              overdue
                ? "overdue"
                : "remaining"
            }
          >
            {overdue
              ? `Quá hạn ${Math.abs(
                  remainingDays
                )} ngày`
              : `Còn ${remainingDays} ngày`}
          </p>
        )}

        {deadline.completed && (
          <p className="done">
            ✓ Đã hoàn thành
          </p>
        )}
      </div>

      <div className="deadline-actions">

        <button
          onClick={handleToggleComplete}
        >
          {deadline.completed
            ? "Bỏ hoàn thành"
            : "Hoàn thành"}
        </button>

        <button
          className="delete"
          onClick={handleDelete}
        >
          Xoá
        </button>

      </div>
    </div>
  );
}

export default memo(DeadlineItem);
