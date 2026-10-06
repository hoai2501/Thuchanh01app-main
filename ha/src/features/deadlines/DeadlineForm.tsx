import { useState } from "react";

import { useAppDispatch } from "../../app/hooks";

import { addDeadline } from "./deadlineSlice";

import type {
  NewDeadline,
  Priority,
} from "../../types/deadline";

function DeadlineForm() {
  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState(false);

  const [subject, setSubject] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [dueDate, setDueDate] =
    useState("");

  const [priority, setPriority] =
    useState<Priority>("Medium");

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !subject.trim() ||
      !title.trim() ||
      !dueDate
    ) {
      alert(
        "Vui lòng nhập đầy đủ thông tin"
      );
      return;
    }

    // Utility Type: Omit
    const newDeadline: NewDeadline = {
      subject,
      title,
      dueDate,
      priority,
    };

    dispatch(
      addDeadline({
        id: Date.now(),
        ...newDeadline,
        completed: false,
      })
    );

    // Reset form
    setSubject("");
    setTitle("");
    setDueDate("");
    setPriority("Medium");

    // Đóng popup
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);

    setSubject("");
    setTitle("");
    setDueDate("");
    setPriority("Medium");
  };

  return (
    <>
      {/* Nút mở popup */}
      <button
        className="open-deadline-btn"
        onClick={() => setIsOpen(true)}
      >
        <span>＋</span>
        Thêm deadline
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="modal-overlay"
          onClick={handleClose}
        >
          <div
            className="deadline-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {/* Header */}
            <div className="modal-header">
              <div>
                <h2>
                  Thêm deadline mới
                </h2>

                <p>
                  Tạo deadline để không bỏ lỡ
                  bài tập
                </p>
              </div>

              <button
                className="modal-close"
                onClick={handleClose}
              >
                ×
              </button>
            </div>

            {/* Form */}
            <form
              className="modal-form"
              onSubmit={handleSubmit}
            >
              {/* Môn học */}
              <div className="form-group">
                <label htmlFor="deadline-subject">
                  <span className="label-icon">
                    📖
                  </span>

                  Môn học
                  <span className="required">
                    *
                  </span>
                </label>

                <input
                  id="deadline-subject"
                  type="text"
                  placeholder="Ví dụ: Lập trình Web nâng cao"
                  value={subject}
                  onChange={(e) =>
                    setSubject(
                      e.target.value
                    )
                  }
                />
              </div>

              {/* Tên bài tập */}
              <div className="form-group">
                <label htmlFor="deadline-title">
                  <span className="label-icon">
                    ☰
                  </span>

                  Tên bài tập
                  <span className="required">
                    *
                  </span>
                </label>

                <input
                  id="deadline-title"
                  type="text"
                  placeholder="Ví dụ: Xây dựng ứng dụng Redux Toolkit"
                  value={title}
                  onChange={(e) =>
                    setTitle(
                      e.target.value
                    )
                  }
                />
              </div>

              {/* Hạn nộp */}
              <div className="form-group">
                <label htmlFor="deadline-due-date">
                  <span className="label-icon">
                    ▣
                  </span>

                  Hạn nộp
                  <span className="required">
                    *
                  </span>
                </label>

                <input
                  id="deadline-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) =>
                    setDueDate(
                      e.target.value
                    )
                  }
                />
              </div>

              {/* Priority */}
              <div className="form-group">
                <label>
                  <span className="label-icon">
                    ⚑
                  </span>

                  Độ ưu tiên
                  <span className="required">
                    *
                  </span>
                </label>

                <div className="priority-options">
                  <button
                    type="button"
                    className={`priority-option low ${
                      priority === "Low"
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      setPriority("Low")
                    }
                  >
                    Thấp
                  </button>

                  <button
                    type="button"
                    className={`priority-option medium ${
                      priority === "Medium"
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      setPriority("Medium")
                    }
                  >
                    Trung bình
                  </button>

                  <button
                    type="button"
                    className={`priority-option high ${
                      priority === "High"
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      setPriority("High")
                    }
                  >
                    Cao
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleClose}
                >
                  × &nbsp; Hủy
                </button>

                <button
                  type="submit"
                  className="submit-deadline-btn"
                >
                  ＋ &nbsp; Thêm deadline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default DeadlineForm;