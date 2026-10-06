import { Profiler, memo, useMemo, useState } from "react";
import { FixedSizeList, type ListChildComponentProps } from "react-window";

import AssignmentCard from "./AssignmentCard";
import { useDeadline } from "../../hooks/useDeadline";
import { useDebounce } from "../../hooks/useDebounce";
import { useAppSelector } from "../../app/hooks";
import { isDevelopment } from "../../app/environment";
import type { Deadline } from "../../types/deadline";
import type { DeadlineStatus } from "../../types/deadline";

interface Props {
  filter: DeadlineStatus;
}

interface RowData {
  deadlines: Deadline[];
}

function AssignmentRow({
  index,
  style,
  data,
}: ListChildComponentProps<RowData>) {
  const deadline = data.deadlines[index];

  return (
    <div style={style}>
      <Profiler
        id={`AssignmentCard-${deadline.id}`}
        onRender={onAssignmentCardRender}
      >
        <AssignmentCard deadline={deadline} />
      </Profiler>
    </div>
  );
}

function onAssignmentCardRender(
  id: string,
  phase: string,
  actualDuration: number
) {
  if (isDevelopment) {
    console.info(
      `[Profiler] ${id} phase=${phase} duration=${actualDuration.toFixed(2)}ms`
    );
  }
}

function DeadlineList({ filter }: Props) {
  const { deadlines } = useDeadline(filter);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm.trim().toLocaleLowerCase(), 300);
  const loading = useAppSelector((state) => state.deadlines.loading);
  const error = useAppSelector((state) => state.deadlines.error);
  const matchingDeadlines = useMemo(
    () =>
      deadlines.filter((deadline) => {
        const searchableText =
          `${deadline.title} ${deadline.subject}`.toLocaleLowerCase();
        return searchableText.includes(debouncedSearch);
      }),
    [deadlines, debouncedSearch]
  );
  const rowData = useMemo<RowData>(
    () => ({ deadlines: matchingDeadlines }),
    [matchingDeadlines]
  );

  if (loading) {
    return <div className="loading-box">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="error-box">⚠️ {error}</div>;
  }

  const listHeight = Math.min(matchingDeadlines.length * 150, 600);

  return (
    <div>
      <div className="task-tools">
        <input
          type="search"
          aria-label="Tìm bài tập"
          placeholder="Tìm theo tên hoặc môn học..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>
      {matchingDeadlines.length === 0 ? (
        <div className="empty">
          {debouncedSearch
            ? "Không tìm thấy bài tập phù hợp."
            : "Không có bài tập nào."}
        </div>
      ) : (
        <div className="deadline-list">
          <FixedSizeList
            height={listHeight}
            width="100%"
            itemCount={matchingDeadlines.length}
            itemSize={150}
            itemData={rowData}
            itemKey={(index, data) => data.deadlines[index].id}
          >
            {AssignmentRow}
          </FixedSizeList>
        </div>
      )}
    </div>
  );
}

export default memo(DeadlineList);
