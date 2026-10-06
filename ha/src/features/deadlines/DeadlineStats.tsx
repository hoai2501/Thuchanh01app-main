import { useMemo } from "react";

import type { Deadline } from "../../types/deadline";
import { calcStats } from "./calculateDeadlineStats";

export function DeadlineStatsPage({
  deadlines,
}: {
  deadlines: Deadline[];
}) {
  const stats = useMemo(() => calcStats(deadlines), [deadlines]);

  return (
    <section className="stats-page" aria-label="Thống kê bài tập">
      <h1>Thống kê bài tập</h1>
      <div className="quick-stats">
        <div className="quick-stat">
          <strong>{stats.total}</strong>
          <small>Tổng bài tập</small>
        </div>
        <div className="quick-stat">
          <strong>{stats.completed}</strong>
          <small>Đã hoàn thành</small>
        </div>
        <div className="quick-stat">
          <strong>{stats.overdue}</strong>
          <small>Quá hạn</small>
        </div>
      </div>
      <h2>Theo môn học</h2>
      <ul>
        {Object.entries(stats.bySubject).map(([subject, count]) => (
          <li key={subject}>
            {subject}: {count}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default DeadlineStatsPage;
