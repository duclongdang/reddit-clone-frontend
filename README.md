# reddit-clone-frontend

Frontend cho dự án Reddit clone: feed bài viết, community, vote, comment lồng nhau, thông báo. Giao tiếp với backend Spring Boot qua REST API.

> **Trạng thái hiện tại:** mới có luồng đăng nhập (email/password và Google OAuth2). Các mục đánh dấu _(dự kiến)_ bên dưới là phần đã chốt hướng nhưng chưa dựng.

## Tech stack

| Mục đích | Thư viện |
|---|---|
| Nền tảng | React 18, TypeScript, Vite |
| Routing | react-router-dom |
| Dữ liệu từ server (cache, phân trang, optimistic update) | @tanstack/react-query |
| Gọi HTTP | axios |
| State phía client (modal, theme, sidebar) | zustand _(dự kiến)_ |
| Styling | Tailwind CSS, clsx, tailwind-merge _(dự kiến)_ |
| Component UI | shadcn/ui (Radix UI), lucide-react _(dự kiến)_ |
| Form và validate | react-hook-form, zod _(dự kiến)_ |
| Render Markdown | react-markdown, remark-gfm, rehype-sanitize _(dự kiến)_ |
| Tiện ích | dayjs, sonner, react-intersection-observer _(dự kiến)_ |
| Chất lượng code | ESLint, Prettier, Vitest, Testing Library, MSW _(dự kiến)_ |

## Cài đặt và chạy

Yêu cầu: Node.js 18 trở lên, backend đang chạy (mặc định ở `http://localhost:8080`).

```bash
npm install
cp .env.local.example .env.local   # sửa URL nếu backend chạy port khác
npm run dev
```

Mở `http://localhost:5173`.

### Biến môi trường

Khai báo trong `.env.local` (file này không commit lên Git). Vite chỉ đọc env lúc khởi động, nên sửa xong phải chạy lại `npm run dev`.

| Biến | Ý nghĩa | Mặc định |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL của backend | `http://localhost:8080` |
| `VITE_GOOGLE_LOGIN_URL` | Endpoint bắt đầu luồng OAuth2 của Spring Security | `http://localhost:8080/oauth2/authorization/google` |

### Scripts

| Lệnh | Tác dụng |
|---|---|
| `npm run dev` | Chạy dev server |
| `npm run build` | Kiểm tra type và build production vào `dist/` |
| `npm run preview` | Chạy thử bản build |
| `npm run lint` | Kiểm tra code bằng ESLint _(dự kiến)_ |
| `npm run test` | Chạy test bằng Vitest _(dự kiến)_ |

## Cấu trúc thư mục

Project chia theo **feature** (nghiệp vụ). Code của một nghiệp vụ nằm chung một chỗ, thay vì chia theo loại file hay theo kích thước component.

```
src/
├── app/                  # (dự kiến) App.tsx, providers, cấu hình router
├── components/           # (dự kiến)
│   ├── ui/               # Component dùng chung, không chứa nghiệp vụ: Button, Input, Avatar, Modal...
│   └── layout/           # MainLayout, Header, Sidebar
├── features/             # Mỗi nghiệp vụ một thư mục
│   ├── auth/             # Đăng nhập, đăng ký, AuthContext, OAuth
│   ├── communities/      # (dự kiến) Danh sách, chi tiết, tạo, join/leave community
│   ├── posts/            # (dự kiến) Feed, chi tiết post, tạo post
│   ├── votes/            # (dự kiến) Upvote/downvote
│   ├── comments/         # (dự kiến) Comment lồng nhau
│   ├── users/            # (dự kiến) Profile, settings
│   └── notifications/    # (dự kiến) Thông báo
├── pages/                # Component gắn với route, chỉ ghép các feature lại
├── lib/                  # Cấu hình thư viện và hàm tiện ích: api client, queryClient, cn(), dayjs
├── routes/               # (dự kiến) ProtectedRoute, định nghĩa routes
├── types/                # Type dùng chung giữa nhiều feature (User, ApiErrorBody...)
└── main.tsx
```

Hiện `api/client.ts` và `api/authApi.ts` đang nằm ở `src/api/`. Khi dựng base, client sẽ chuyển vào `lib/`, còn API của từng nghiệp vụ chuyển vào feature tương ứng.

### Cấu trúc bên trong một feature

```
features/posts/
├── api.ts          # Hàm gọi API của feature
├── hooks.ts        # Hook React Query: usePosts, useCreatePost...
├── types.ts        # Type riêng của feature
└── components/     # PostCard, PostList, CreatePostForm...
```

Không phải feature nào cũng cần đủ các file trên. File nào cần thì mới tạo.

## Quy ước

**Đặt code ở đâu**
- Code chỉ một feature dùng thì để trong feature đó.
- Khi có từ 2 feature trở lên cần dùng thì mới chuyển ra `components/ui`, `lib/` hoặc `types/`.
- Feature không import trực tiếp từ bên trong feature khác. Nếu cần dùng chung thì đưa phần đó ra thư mục dùng chung.
- `pages/` chỉ ghép component lại, không gọi API trực tiếp và không chứa logic nặng.

**Dữ liệu**
- Mọi dữ liệu từ server đi qua React Query, không lưu bản sao vào `useState` hay zustand.
- zustand chỉ dùng cho state của giao diện (modal, theme, sidebar).
- Mọi request đi qua api client chung, để tự gắn token và xử lý lỗi ở một chỗ.

**Đặt tên**
- Component: `PascalCase.tsx` (ví dụ `PostCard.tsx`).
- Hook: bắt đầu bằng `use` (ví dụ `usePosts`).
- File khác: `camelCase.ts`.

## Xác thực

- Đăng nhập bằng email/password gọi `POST /api/auth/login`. Đăng nhập bằng Google thì redirect sang endpoint OAuth2 của Spring Security.
- Sau khi đăng nhập Google, backend redirect về `/oauth/callback?accessToken=...&refreshToken=...`.
- Access token và refresh token được lưu trong `localStorage`. Api client tự gắn header `Authorization: Bearer <token>` vào mọi request.
- Khi tải lại trang, `AuthContext` gọi `GET /api/users/me` để khôi phục thông tin user.

Cấu hình phía backend để luồng OAuth2 chạy được (success handler, CORS, checklist khi lỗi) xem ở [docs/backend-oauth-setup.md](docs/backend-oauth-setup.md).
