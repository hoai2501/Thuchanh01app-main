# Báo cáo nâng cấp ứng dụng StudyTask

**Ngày thực hiện:** 06/10/2026  
**Phạm vi:** Quản lý state, tối ưu hiệu năng và kiểm thử

## 1. Mục tiêu

Nâng cấp ứng dụng quản lý deadline bài tập để hỗ trợ ghim bài, đổi giao diện sáng/tối, xử lý danh sách lớn, tải thống kê theo nhu cầu và bổ sung bộ kiểm thử tự động.

## 2. Kết quả thực hiện

### Phần A — Quản lý state

- Tạo Zustand store `usePinStore` với `pinnedIds`, `togglePin(id)` và `isPinned(id)`.
- Trạng thái ghim được lưu trong LocalStorage bằng key `student-deadline-pins`; bài được ghim ưu tiên lên đầu danh sách. State ghim không được đưa vào Redux.
- Tạo `ThemeContext` riêng, memoize giá trị provider bằng `useMemo` và thêm điều khiển đổi theme.
- Thêm Redux Logger chỉ trong development để theo dõi các action Redux liên quan đến thao tác với deadline.
- Tích hợp React Profiler và log phục vụ việc quan sát render trong môi trường development.

### Phần B — Tối ưu hiệu năng

- Thêm nút **Tạo 10.000 bài tập mẫu** để tạo dữ liệu stress test. Có thể mở trực tiếp bằng URL `/?stress=10000`.
- Memoize card bài tập bằng `React.memo`; dùng `useCallback` cho các handler hoàn thành, xoá và ghim.
- Thêm tìm kiếm theo tên bài tập hoặc môn học, debounce 300 ms và lọc danh sách bằng `useMemo`.
- Dùng `react-window` để chỉ render các hàng đang hiển thị và overscan lân cận thay vì gắn cả 10.000 card vào DOM.
- Tách trang thống kê thành module tải bằng `React.lazy`/`Suspense`; trang thống kê có tổng số bài, số bài đã hoàn thành, số bài quá hạn và số lượng theo môn học.
- Dùng `useMemo` cho các phép tính thống kê và danh sách deadline gần đây.

### Phần C — Kiểm thử

- Cấu hình Jest, `ts-jest`, jsdom và React Testing Library; `npm test` chạy Jest.
- Đặt ngưỡng coverage tối thiểu 70% statements cho thư mục `src/features/` trong `jest.config.ts`.
- Bộ test bao phủ utility ngày đến hạn/thống kê, reducer, card và form, các trạng thái bất đồng bộ của danh sách, hook debounce và giỏ hàng.

## 3. Đo lường hiệu năng sau tối ưu

Đo lại ngày **06/10/2026** trên bản production tại `http://127.0.0.1:4173/?stress=10000`, dùng Lighthouse CLI 13.5.0 và Chrome local. Hai lượt Lighthouse liên tiếp cho kết quả giống nhau:

| Chỉ số | Trước tối ưu | Sau tối ưu |
|---|---:|---:|
| Số card DOM khi danh sách 10.000 bài không lọc | Chưa đo trước khi thay đổi | 6 card tại viewport kiểm thử (các hàng hiển thị và overscan) |
| Số card DOM khi tìm “Bài tập mẫu 9999” | Chưa đo trước khi thay đổi | 1 card khớp |
| `AssignmentCard` render function khi tải 6 card ban đầu (development + Strict Mode) | Chưa đo trước khi thay đổi | 12 lời gọi (Strict Mode gọi mỗi card 2 lần); Profiler ghi nhận 6 mount commit |
| `AssignmentCard` render function khi nhập tìm kiếm khớp duy nhất | Chưa đo trước khi thay đổi | 2 lời gọi cho card khớp trong development + Strict Mode; sau debounce, DOM còn 1 card |
| Lighthouse Performance — lượt 1 / lượt 2 | Chưa đo trước khi thay đổi | **99/100 / 99/100** |
| First Contentful Paint (FCP) | Chưa đo trước khi thay đổi | 1,4 giây (cả hai lượt) |
| Largest Contentful Paint (LCP) | Chưa đo trước khi thay đổi | 1,5 giây (cả hai lượt) |
| Speed Index | Chưa đo trước khi thay đổi | 1,4 giây (cả hai lượt) |
| Total Blocking Time (TBT) | Chưa đo trước khi thay đổi | 140 ms (cả hai lượt) |
| Cumulative Layout Shift (CLS) | Chưa đo trước khi thay đổi | 0 (cả hai lượt) |

**Lưu ý về baseline:** Không có số đo Profiler hoặc Lighthouse của phiên bản trước tối ưu được ghi nhận trước khi thay đổi. Vì vậy báo cáo không suy đoán số liệu “trước”; muốn có so sánh định lượng đầy đủ cần checkout/chạy phiên bản cũ trong cùng môi trường rồi đo lại theo cùng quy trình.

**Lưu ý khi đếm render:** React Strict Mode trong development có thể gọi component nhiều lần để phát hiện side effect. Khi so sánh, ưu tiên số commit trong React DevTools Profiler; các `console.count` chỉ giúp quan sát nhanh.

## 4. Kết quả kiểm thử và kiểm tra chất lượng

| Lệnh | Kết quả |
|---|---|
| `npm test -- --coverage` | Thành công — 12 test suites, 32 tests |
| Coverage statements cho `src/features/` | **89,94%**, vượt ngưỡng 70% |
| `npm run build` | Thành công — TypeScript và Vite production build |
| `npm run lint` | Thành công |

## 5. Chạy lại kiểm tra

Trong thư mục `ha`:

```sh
npm test -- --coverage
npm run build
npm run lint
```

Chạy Lighthouse trên bản production:

```sh
npm run build
npm run preview -- --host 127.0.0.1
npm exec --yes --package=lighthouse -- lighthouse \
  'http://127.0.0.1:4173/?stress=10000' \
  --only-categories=performance
```

Để xem dữ liệu và hành vi tìm kiếm, chạy `npm run dev`, mở `/?stress=10000`, rồi sử dụng React DevTools **Profiler**. Báo cáo Lighthouse cần được so sánh trong điều kiện thiết bị, phiên bản trình duyệt, cache và mạng tương đồng.
