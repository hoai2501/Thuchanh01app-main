import {
  lazy,
  Profiler,
  Suspense,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useAppDispatch,
  useAppSelector,
} from "./app/hooks";

import {
  fetchDeadlines,
  replaceDeadlines,
} from "./features/deadlines/deadlineSlice";

import DeadlineForm from "./features/deadlines/DeadlineForm";
import DeadlineList from "./features/deadlines/DeadlineList";
import DeadlineFilter from "./components/DeadlineFilter";
import { useTheme } from "./ThemeContext";

import type {
  Deadline,
  DeadlineStatus,
} from "./types/deadline";

import "./App.css";

const DeadlineStats = lazy(
  () => import("./features/deadlines/DeadlineStats")
);

const handleProfileRender = (
  id: string,
  phase: string,
  actualDuration: number
) => {
  if (import.meta.env.DEV) {
    console.info(
      `[Profiler:${id}] phase=${phase} duration=${actualDuration.toFixed(2)}ms`
    );
  }
};

const MemoizedDeadlineList = memo(DeadlineList);

function generateSampleDeadlines(count: number): Deadline[] {
  const subjects = [
    "Lập trình Web",
    "Cơ sở dữ liệu",
    "Kiểm thử phần mềm",
    "Phân tích nghiệp vụ",
    "Mạng máy tính",
  ];
  const today = new Date();
  const idBase = Date.now();

  return Array.from({ length: count }, (_, index) => {
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + (index % 60) - 20);

    return {
      id: idBase + index,
      subject: subjects[index % subjects.length],
      title: `Bài tập mẫu ${index + 1}`,
      dueDate: dueDate.toISOString().slice(0, 10),
      priority: (["Low", "Medium", "High"] as const)[index % 3],
      completed: index % 5 === 0,
    };
  });
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}

function App() {
  const dispatch = useAppDispatch();

  const deadlines = useAppSelector(
    (state) => state.deadlines.items
  );

  const [filter, setFilter] =
    useState<DeadlineStatus>("all");
  const [showStats, setShowStats] = useState(false);

  const createStressData = useCallback(() => {
    dispatch(replaceDeadlines(generateSampleDeadlines(10_000)));
    setShowStats(false);
  }, [dispatch]);

  /* ================================
     LOAD DATA
  ================================= */

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("stress") === "10000") {
      dispatch(replaceDeadlines(generateSampleDeadlines(10_000)));
      return;
    }

    dispatch(fetchDeadlines());
  }, [dispatch]);

  /* ================================
     STATISTICS
  ================================= */

  const total = deadlines.length;
  const { completed, pending, overdue } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return deadlines.reduce(
      (stats, item) => {
        const dueDate = new Date(item.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        if (item.completed) stats.completed += 1;
        else {
          stats.pending += 1;
          if (dueDate < today) stats.overdue += 1;
        }
        return stats;
      },
      { completed: 0, pending: 0, overdue: 0 }
    );
  }, [deadlines]);

  /* ================================
     RECENT DEADLINES
  ================================= */

  const recentDeadlines = useMemo(
    () =>
      [...deadlines]
        .sort(
        (a, b) =>
          new Date(
            a.dueDate
          ).getTime() -
          new Date(
            b.dueDate
          ).getTime()
        )
        .slice(0, 3),
    [deadlines]
  );

  return (
    <div className="app">

      {/* =================================
          SIDEBAR
      ================================= */}

      <aside className="sidebar">

        {/* LOGO */}

        <div className="brand">

          <div className="brand-icon">
            ✓
          </div>

          <div className="brand-text">

            <strong>
              StudyTask
            </strong>

            <span>
              Học tốt hơn mỗi ngày
            </span>

          </div>

        </div>


        {/* MENU */}

        <nav className="sidebar-menu">

          <div className="menu-item active">

            <span className="menu-icon">
              ⌂
            </span>

            <strong>
              Trang chủ
            </strong>

          </div>

        </nav>

      </aside>


      {/* =================================
          MAIN
      ================================= */}

      <main className="main">

        {/* =================================
            TOP BAR
        ================================= */}

        <header className="topbar">

          <div className="page-title">
            Student Deadline Tracker
          </div>

          <div className="profile">

            <div className="notification">

              ♧

              {overdue > 0 && (
                <b>
                  {overdue}
                </b>
              )}

            </div>

            <button
              type="button"
              className="stats-toggle"
              onClick={() => setShowStats((visible) => !visible)}
            >
              {showStats ? "Danh sách" : "Thống kê"}
            </button>

            <ThemeToggle />

            <div className="avatar">
              T
            </div>

            <span>
              Hoài
            </span>

            <small>
              ⌄
            </small>

          </div>

        </header>


        {/* =================================
            DASHBOARD
        ================================= */}

        {showStats ? (
          <Suspense fallback={<div className="loading-box">Đang tải thống kê...</div>}>
            <DeadlineStats deadlines={deadlines} />
          </Suspense>
        ) : (
        <Profiler
          id="deadline-dashboard"
          onRender={handleProfileRender}
        >
          <div className="dashboard">

          {/* =================================
              CENTER CONTENT
          ================================= */}

          <section className="center-content">

            {/* WELCOME */}

            <div className="welcome">

              <div className="welcome-content">

                <div className="welcome-label">
                  STUDENT PRODUCTIVITY
                </div>

                <h1>
                  Xin chào, Hoài! 
                </h1>

                <p>
                  Cố lên! Mỗi bài tập hoàn thành
                  là một bước tiến gần hơn đến mục tiêu của bạn.
                </p>

              </div>

              <div className="welcome-decoration">
                📚
              </div>

            </div>


            {/* =================================
                FILTER
            ================================= */}

            <DeadlineFilter>

              <DeadlineFilter.Item
                value="all"
                current={filter}
                onClick={setFilter}
              >
                Tất cả

                <b>
                  {total}
                </b>

              </DeadlineFilter.Item>


              <DeadlineFilter.Item
                value="pending"
                current={filter}
                onClick={setFilter}
              >
                Chưa hoàn thành

                <b>
                  {pending}
                </b>

              </DeadlineFilter.Item>


              <DeadlineFilter.Item
                value="overdue"
                current={filter}
                onClick={setFilter}
              >
                Quá hạn

                <b>
                  {overdue}
                </b>

              </DeadlineFilter.Item>


              <DeadlineFilter.Item
                value="completed"
                current={filter}
                onClick={setFilter}
              >
                Đã hoàn thành

                <b>
                  {completed}
                </b>

              </DeadlineFilter.Item>

            </DeadlineFilter>


            {/* =================================
                DEADLINE SECTION
            ================================= */}

            <section className="task-section">

              <div className="task-header">

                <div>

                  <h2>
                    Danh sách bài tập
                  </h2>

                  <p>
                    Theo dõi các deadline
                    và tiến độ học tập
                  </p>

                </div>

                <span className="task-count">
                  {total} bài tập
                </span>

              </div>

              <div className="task-tools">
                <button type="button" onClick={createStressData}>
                  Tạo 10.000 bài tập mẫu
                </button>
              </div>

              {/* DEADLINE LIST */}

              <MemoizedDeadlineList
                filter={filter}
              />

            </section>

          </section>


          {/* =================================
              RIGHT SIDEBAR
          ================================= */}

          <aside className="right-sidebar">

            {/* QUICK STATISTICS */}

            <section className="side-card">

              <div className="side-title">

                <h3>
                  ▥ Thống kê nhanh
                </h3>

              </div>


              <div className="quick-stats">

                <div className="quick-stat red">

                  <span>
                    ▣
                  </span>

                  <div>

                    <strong>
                      {total}
                    </strong>

                    <small>
                      Tổng bài tập
                    </small>

                  </div>

                </div>


                <div className="quick-stat green">

                  <span>
                    ✓
                  </span>

                  <div>

                    <strong>
                      {completed}
                    </strong>

                    <small>
                      Đã hoàn thành
                    </small>

                  </div>

                </div>


                <div className="quick-stat pink">

                  <span>
                    ◷
                  </span>

                  <div>

                    <strong>
                      {pending}
                    </strong>

                    <small>
                      Chưa hoàn thành
                    </small>

                  </div>

                </div>


                <div className="quick-stat orange">

                  <span>
                    ⚠
                  </span>

                  <div>

                    <strong>
                      {overdue}
                    </strong>

                    <small>
                      Quá hạn
                    </small>

                  </div>

                </div>

              </div>

            </section>


            {/* UPCOMING DEADLINES */}

            <section className="side-card">

              <div className="side-title">

                <h3>
                  ▣ Hạn nộp gần đây
                </h3>

                <span>
                  {total} bài
                </span>

              </div>


              <div className="upcoming-list">

                {recentDeadlines.length === 0 && (
                  <div className="no-upcoming">
                    Chưa có deadline
                  </div>
                )}

                {recentDeadlines.map(
                  (deadline) => {

                    const dueDate =
                      new Date(
                        deadline.dueDate
                      );

                    const currentDate =
                      new Date();

                    currentDate.setHours(
                      0,
                      0,
                      0,
                      0
                    );

                    dueDate.setHours(
                      0,
                      0,
                      0,
                      0
                    );

                    const days =
                      Math.ceil(
                        (
                          dueDate.getTime() -
                          currentDate.getTime()
                        ) /
                        (
                          1000 *
                          60 *
                          60 *
                          24
                        )
                      );

                    return (
                      <div
                        className="upcoming-item"
                        key={deadline.id}
                      >

                        <div className="timeline-dot">
                        </div>

                        <div className="upcoming-info">

                          <strong>
                            {deadline.title}
                          </strong>

                          <small>
                            {deadline.subject}
                          </small>

                          <small>
                            Hạn:{" "}
                            {deadline.dueDate}
                          </small>

                        </div>

                        <span
                          className={
                            days < 0
                              ? "late"
                              : "soon"
                          }
                        >
                          {days < 0
                            ? `Quá hạn ${Math.abs(days)} ngày`
                            : `Còn ${days} ngày`}
                        </span>

                      </div>
                    );
                  }
                )}

              </div>

            </section>


            {/* ADD DEADLINE */}

            <section className="side-card add-card">

              <div className="side-title">

                <h3>
                  ＋ Thêm bài tập mới
                </h3>

              </div>

              <p>
                Tạo deadline mới để quản lý
                công việc học tập.
              </p>

              <DeadlineForm />

            </section>

          </aside>

          </div>
        </Profiler>
        )}


        {/* =================================
            FOOTER
        ================================= */}

        <footer>
          StudyTask · Student Deadline Tracker
        </footer>

      </main>

    </div>
  );
}

export default App;