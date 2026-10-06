import type { Deadline } from "../../types/deadline";

export async function fetchDeadlineApi(): Promise<Deadline[]> {
  await new Promise((resolve) => window.setTimeout(resolve, 300));

  return [
    {
      id: 1,
      subject: "Lập trình Web",
      title: "Bài tập React",
      dueDate: "2026-10-10",
      priority: "High",
      completed: false,
    },
    {
      id: 2,
      subject: "Cơ sở dữ liệu",
      title: "Thiết kế Database",
      dueDate: "2026-10-20",
      priority: "Medium",
      completed: false,
    },
    {
      id: 3,
      subject: "Phân tích nghiệp vụ",
      title: "Vẽ Use Case",
      dueDate: "2026-10-12",
      priority: "High",
      completed: false,
    },
    {
      id: 4,
      subject: "Kiểm thử phần mềm",
      title: "Viết Test Case",
      dueDate: "2026-10-25",
      priority: "Low",
      completed: true,
    },
  ];
}
