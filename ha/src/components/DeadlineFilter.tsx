
import type {
  ReactNode,
} from "react";

import type {
  DeadlineStatus,
} from "../types/deadline";

interface FilterProps {
  children: ReactNode;
}

interface ItemProps {
  value: DeadlineStatus;

  current: DeadlineStatus;

  onClick: (
    value: DeadlineStatus
  ) => void;

  children: ReactNode;
}

function DeadlineFilter({
  children,
}: FilterProps) {
  return (
    <div className="filter">
      {children}
    </div>
  );
}

function Item({
  value,
  current,
  onClick,
  children,
}: ItemProps) {
  return (
    <button
      className={
        current === value
          ? "active"
          : ""
      }
      onClick={() =>
        onClick(value)
      }
    >
      {children}
    </button>
  );
}

DeadlineFilter.Item = Item;

export default DeadlineFilter;
