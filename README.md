# Portfolio — Trắng & Mint

Portfolio cá nhân **hai trang**, viết bằng HTML/CSS/JS thuần — không framework, không build, không server.

| Trang | Dùng để | Chia sẻ |
| --- | --- | --- |
| `edit.html` | Trang quản trị: soạn nội dung, tải ảnh, xem trước | Không chia sẻ |
| `index.html` | Trang công khai, chỉ đọc | Mở trực tiếp hoặc gửi file đã xuất |

Cách chia sẻ: soạn trên `edit.html` → bấm **Xuất bản HTML** → gửi file `.html` vừa tải cho mọi người. File đó **tự chứa toàn bộ** (CSS, JS, ảnh đều nằm bên trong) nên người nhận chỉ cần bấm mở là xem, không cần gửi kèm thư mục nào.

## Chạy thử

Mở trực tiếp `edit.html` trong trình duyệt là được (không cần build, hoạt động trên `file://`).

Nếu muốn chạy qua HTTP server (khuyến nghị để IndexedDB hoạt động ổn định):

```bash
# Python 3
python -m http.server 8000

# hoặc Node
npx serve .
```

Sau đó mở `http://localhost:8000/edit.html`.

## Quy trình sử dụng

1. Mở **`edit.html`**.
2. Soạn ở 6 mục: **Thông tin cá nhân**, **Giới thiệu**, **Dự án**, **Hành trình**, **Liên hệ**, **Ảnh nền**.
3. Nhìn khung **Xem trước** bên phải (chuyển desktop / tablet / mobile bằng 3 nút trên cùng).
4. Bấm **Xuất bản HTML** → tải về `portfolio-<tên>.html`.
5. Gửi file đó cho người khác, hoặc kéo vào trình duyệt để tự kiểm tra lại.

Mọi thay đổi được **tự động lưu nháp** (IndexedDB, dự phòng bằng `localStorage`) — tắt trình duyệt rồi mở lại vẫn còn. Trang **`index.html`** hiển thị đúng nội dung bạn đã soạn.

## Tính năng trang quản trị

- **Sửa trực tiếp**: họ tên, chức danh, mô tả, email, mạng xã hội, kỹ năng, số liệu.
- **Danh sách lặp** (dự án / hành trình / kỹ năng / số liệu): thêm, xoá, sắp xếp lên xuống.
- **Ảnh đại diện**: tải lên JPG/PNG/WebP — tự nén (≤600px, webp) bằng `<canvas>`. Để trống sẽ tự sinh ảnh chữ viết tắt.
- **Ảnh nền**: chọn 1 trong 4 nền mint có sẵn, hoặc tải ảnh của riêng bạn (tự resize ≤1920px, nén webp). Thanh trượt **Độ phủ** và **Độ mờ** chỉnh ngay trên khung xem trước.
- **Xem trước trực tiếp**: khung dựng lại HTML thật từ dữ liệu, nên thấy đúng thứ người khác sẽ thấy.
- **Sao lưu / khôi phục** dữ liệu dạng `.json` (trong nút ⋯) để chuyển nội dung sang máy khác.
- **Đặt lại toàn bộ** về nội dung mặc định.

Ảnh chỉ lưu trên trình duyệt của máy bạn. Muốn người khác thấy ảnh đó, hãy **xuất file HTML** — ảnh đã được nhúng vào trong file.

## Cấu trúc

```
.
├── index.html            # Trang công khai (vỏ trang: nhúng CSS + chạy runtime)
├── edit.html             # Trang quản trị (giao diện + mẫu biểu mẫu)
├── css/
│   └── editor.css        # Kiểu cho trang quản trị
├── js/
│   ├── public-styles.js  # CSS của trang công khai (dạng chuỗi → nhúng được khi xuất file)
│   ├── public-data.js    # 4 nền mint dạng SVG data-URL + dữ liệu mặc định
│   ├── public-render.js  # Bộ dựng HTML dùng chung cho cả 2 trang
│   ├── public-runtime.js # JS chạy trên trang công khai (menu, hiệu ứng cuộn, sao chép email)
│   ├── build-page.js     # Ghép HTML + CSS + JS thành 1 file tự chứa
│   └── editor.js         # Logic trang quản trị: biểu mẫu, nháp, xem trước, xuất bản
└── README.md
```

## Vì sao phải xuất một file riêng?

Khi mở từ `file://`, trình duyệt chặn `fetch`, đọc `cssRules` và iframe liên tệp — nên không thể "mượn" CSS/JS từ file khác. Vì vậy `public-styles.js` và `public-runtime.js` được giữ dưới dạng **chuỗi** trong JS, để `build-page.js` ghép thẳng vào file xuất bản. Ảnh nền mặc định cũng là SVG data-URL nên không có phụ thuộc tệp ngoài.

## Tùy biến nhanh

Đổi bảng màu trong chuỗi CSS của `js/public-styles.js`:

```css
:root {
  --bg-base: #f7fbfa;
  --accent: #7fbfae;
  --accent-soft: #d8ece6;
  --text: #2f3b39;
}
```

Thêm nền mặc định: thêm 1 phần tử vào `PORTFOLIO_PRESETS` trong `js/public-data.js` (dùng helper `svgUrl(...)` để mã hoá SVG thành data-URL an toàn cho CSS).

## Ghi chú

- `localStorage` giới hạn khoảng 5MB/domain; bước resize + nén webp giúp ảnh thường chỉ chiếm vài trăm KB.
- Toàn bộ xử lý ảnh diễn ra cục bộ trên máy người dùng, không có gì được gửi đi.
- Hiệu ứng cuộn có lớp an toàn: nếu trình duyệt không đẩy frame (tab ẩn…), nội dung trong màn hình đầu vẫn hiển thị sau 1.2 giây.
