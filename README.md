# AI Motion Equation Lab

Ứng dụng React + Vite giúp học sinh THCS lập, giải và kiểm chứng phương trình bậc nhất qua bài toán chuyển động trên đoạn AB.

## Chạy ứng dụng

```bash
npm install
npm run dev
```

Mở địa chỉ Vite hiển thị trong terminal. Tạo bản dựng production bằng `npm run build`.

## Cấu trúc

- `src/utils/solver.js`: kiểm tra dữ liệu, lập phương trình, giải và kiểm chứng nghiệm.
- `src/utils/testCases.js`: 13 ca kiểm thử cho bộ giải.
- `src/data/`: bài toán mẫu và câu hỏi dẫn dắt.
- `src/components/`: biểu mẫu, lời giải từng bước, đồ thị và mô phỏng.
- `src/pages/`: trang chủ, giải bài toán, mô phỏng, test cases và câu hỏi.
- `src/styles.css`: thiết kế responsive, chủ đề phòng thí nghiệm toán học.

## Mô hình toán học

Với tọa độ xuất phát `p`, chiều `d ∈ {-1, 1}`, vận tốc `v` và giờ xuất phát `h`, vị trí sau mốc thời gian `t` là `s(t) = p + d·v·(t − h)` (khi `t ≥ h`). Hai xe gặp nhau khi tọa độ bằng nhau, đồng thời nghiệm phải thuộc miền thời gian và đoạn AB.
