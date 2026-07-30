#Agent Instructions

Mọi coding agent làm việc trong repository này phải đọc toàn bộ file trước khi thay đổi code.

Các quy tắc trong file này áp dụng cho toàn bộ dự án.

Khi hướng dẫn trong một phase xung đột với file này, ưu tiên `AGENTS.md`, trừ khi phase giải thích rõ lý do cần thay đổi.

---

## 1. Vai trò

Bạn đang đóng vai trò Senior Frontend Engineer phụ trách xây dựng frontend clone Threads ở mức production-ready.

Bạn phải trực tiếp đọc repository, chỉnh sửa code, chạy kiểm tra và báo cáo kết quả.

Không chỉ đưa code mẫu hoặc giải thích lý thuyết.

---

## 2. Mục tiêu dự án

Xây dựng frontend clone Threads có giao diện và hành vi gần giống phiên bản tham chiếu nhất có thể, bao gồm:

- Authentication.
- Home feed.
- Following feed.
- Hiển thị bài viết.
- Chi tiết bài viết.
- Replies.
- Tạo bài viết.
- Upload media nếu API hỗ trợ.
- Like và unlike.
- Reply.
- Repost hoặc quote post nếu API hỗ trợ.
- Follow và unfollow.
- Profile.
- Search.
- Notifications.
- Settings.
- Responsive desktop, tablet và mobile.
- Light theme.
- Dark theme.
- System theme tự động theo thiết bị.

Backend API đã có sẵn.

Không được tự phát minh endpoint hoặc thay đổi API contract.

---

## 3. Tech stack bắt buộc

- Next.js App Router.
- React.
- TypeScript strict mode.
- Tailwind CSS.
- shadcn/ui.
- Axios.
- TanStack Query.
- Zustand.
- React Hook Form.
- Yup.
- `@hookform/resolvers`.
- `next-themes`.
- Lucide React.
- Sonner hoặc toast component tương đương.
- ESLint.
- Prettier.
- Testing Library.
- Playwright.

Không cài Redux Toolkit vì dự án sử dụng Zustand cho global client state.

Không cài nhiều thư viện có cùng trách nhiệm nếu không có lý do rõ ràng.

---

## 4. Quy tắc quản lý state

### 4.1. TanStack Query

TanStack Query là nguồn quản lý server state, bao gồm:

- Feed.
- Posts.
- Replies.
- Post detail.
- User hiện tại.
- Profile.
- Followers.
- Following.
- Follow relationships.
- Search results.
- Notifications.
- Các dữ liệu lấy từ API.
- Trạng thái loading, error và caching của API.

Không sao chép dữ liệu từ TanStack Query sang Zustand.

Không gọi API rồi lưu response vào Zustand.

Không tạo một Zustand store chứa feed, posts, profiles hoặc notifications.

### 4.2. Zustand

Zustand chỉ được dùng cho global client state thực sự cần chia sẻ giữa nhiều khu vực, ví dụ:

- Composer đang mở hay đóng.
- Loại composer hiện tại.
- Global modal.
- Mobile navigation.
- Temporary shared draft.
- Các UI state không thuộc server và không phù hợp với URL.

Không sử dụng Zustand khi component state đã đủ.

Không sử dụng Zustand để thay thế TanStack Query.

### 4.3. React component state

Sử dụng React state cho:

- Trạng thái cục bộ.
- Dropdown cục bộ.
- Toggle chỉ thuộc một component.
- Preview tạm thời.
- Interaction không cần chia sẻ toàn ứng dụng.

### 4.4. URL state

Sử dụng route params hoặc search params cho:

- Search keyword.
- Feed tab.
- Profile tab.
- Filter.
- Sort.
- State cần bookmark.
- State cần chia sẻ bằng URL.
- State cần hoạt động đúng với browser back và forward.

### 4.5. Theme state

Theme được quản lý bằng `next-themes`.

Không lưu light, dark hoặc system theme trong Zustand.

---

## 5. Quy tắc API

- Tạo một Axios instance dùng chung.
- Không gọi Axios trực tiếp trong React component.
- API request phải nằm trong feature API module hoặc API layer.
- Base URL phải lấy từ environment variable.
- Cấu hình timeout.
- Cấu hình headers phù hợp.
- Chuẩn hóa API error thành `AppError`.
- Không hiển thị raw backend error thiếu kiểm soát.
- Hỗ trợ `AbortSignal` khi request có thể bị hủy.
- Không tự phát minh endpoint.
- Không tự đổi request hoặc response contract.
- Không dùng mock data trong production code.
- Mock chỉ được dùng trong test hoặc khi được yêu cầu rõ ràng.
- Không log token hoặc thông tin nhạy cảm.

Nếu API dùng refresh token:

- Chỉ cho phép một refresh request chạy tại một thời điểm.
- Các request 401 đang chờ phải được retry sau khi refresh thành công.
- Không retry refresh token vô hạn.
- Refresh thất bại phải kết thúc session an toàn.
- Không gây request loop hoặc redirect loop.

Nếu backend hỗ trợ secure HTTP-only cookie, ưu tiên flow đó.

Không lưu access token vào localStorage nếu không bị API contract bắt buộc.

---

## 6. Quy tắc TanStack Query

- Tạo query key factory theo từng feature.
- Không viết query key rải rác thiếu kiểm soát.
- Dùng `useInfiniteQuery` khi API hỗ trợ cursor hoặc pagination phù hợp.
- Không gọi cùng một API nhiều lần cho cùng một resource.
- Mutation phải có loading, success và error state.
- Dùng optimistic update cho like, follow, repost hoặc save khi phù hợp.
- Optimistic update phải có rollback khi API lỗi.
- Không invalidate toàn bộ query cache nếu chỉ một resource thay đổi.
- Chỉ update hoặc invalidate các query liên quan.
- Đồng bộ cùng một post giữa feed, detail và profile.
- Không để count âm.
- Không để click nhanh làm tăng hoặc giảm count sai.
- Không chép query data sang Zustand.

---

## 7. Quy tắc form

Tất cả form nghiệp vụ phải dùng:

- React Hook Form.
- Yup.
- `yupResolver`.

Form phải:

- Có type rõ ràng.
- Có validation schema.
- Hiển thị lỗi cạnh field tương ứng.
- Hiển thị lỗi server ở vị trí phù hợp.
- Disable submit trong khi mutation chạy.
- Ngăn submit lặp.
- Có label.
- Có `aria-invalid` khi cần.
- Có accessible error message.
- Focus field lỗi đầu tiên khi phù hợp.
- Xử lý dirty state.
- Xác nhận khi đóng form đang có dữ liệu chưa lưu nếu cần.

Không tự quản lý toàn bộ form bằng nhiều `useState` nếu React Hook Form phù hợp hơn.

---

## 8. Design System

Dự án bắt buộc phải có Design System thống nhất.

Design System phải đảm bảo:

- Giao diện bám sát Threads.
- Màu sắc đồng bộ.
- Typography đồng bộ.
- Spacing đồng bộ.
- Radius đồng bộ.
- Interaction states đồng bộ.
- Responsive behavior đồng bộ.
- Accessibility đồng bộ.
- Hỗ trợ light, dark và system theme.

Design System được mô tả tại:

```text
docs/design-system.md
```

Mọi agent phải tuân thủ tài liệu này.

### 8.1. Semantic tokens

Không hardcode màu trực tiếp như:

```tsx
className="bg-white text-black border-gray-200"
```

Ưu tiên semantic tokens:

```tsx
className="bg-background text-foreground border-border"
```

Không đặt token theo tên màu vật lý như:

- `black-text`.
- `white-background`.
- `gray-card`.

Ưu tiên tên theo ý nghĩa:

- `background`.
- `foreground`.
- `surface`.
- `surface-raised`.
- `muted`.
- `muted-foreground`.
- `border`.
- `primary`.
- `secondary`.
- `destructive`.
- `ring`.

### 8.2. Theme modes

Ứng dụng phải hỗ trợ:

- `light`.
- `dark`.
- `system`.

Theme mặc định là `system`.

System theme phải thay đổi theo cài đặt thiết bị mà không cần reload.

Theme preference phải được lưu lại.

Không tự viết lại cơ chế theo dõi `prefers-color-scheme` nếu `next-themes` đã xử lý.

### 8.3. Theme hydration

Theme không được gây hydration mismatch.

Không sử dụng `window`, `document` hoặc `localStorage` trong Server Component.

Component phụ thuộc trực tiếp vào resolved theme phải xử lý mounted state khi cần.

Không để ThemeSwitcher hiển thị icon sai rõ rệt khi trang vừa tải.

### 8.4. shadcn/ui

shadcn/ui chỉ được dùng như accessible primitives.

Phải tùy biến:

- Colors.
- Typography.
- Border.
- Radius.
- Shadow.
- Spacing.
- Hover state.
- Focus state.

Không giữ nguyên giao diện shadcn mặc định nếu không giống Threads.

---

## 9. Quy tắc UI

Clone sát UI reference về:

- Layout.
- Column width.
- Navigation width.
- Spacing.
- Typography.
- Colors.
- Border.
- Radius.
- Avatar.
- Icon size.
- Hover.
- Active.
- Focus-visible.
- Disabled.
- Loading.
- Empty.
- Error.
- Responsive behavior.
- Sticky behavior.
- Mobile navigation.

UI phải:

- Hiện đại.
- Sạch.
- Thân thiện.
- Dễ nhìn.
- Không quá dày đặc.
- Không có horizontal scroll ngoài ý muốn.
- Không để mobile navigation che nội dung.
- Không để modal vượt viewport.

Không dùng emoji thay icon UI.

Sử dụng Lucide React cho icon thông thường.

Không copy tài sản thương hiệu độc quyền nếu chúng không được cung cấp trong repository.

---

## 10. Accessibility

- Sử dụng semantic HTML.
- Dùng `button` cho action.
- Dùng `a` hoặc Next Link cho navigation.
- Không dùng `div` clickable nếu button hoặc link phù hợp hơn.
- Icon button phải có accessible name.
- Form phải có label.
- Dialog phải quản lý focus.
- Có keyboard navigation.
- Có `focus-visible`.
- Có heading hierarchy hợp lý.
- Có landmark.
- Có alt text phù hợp.
- Đảm bảo contrast ở cả light và dark mode.
- Hỗ trợ `prefers-reduced-motion`.
- Active navigation dùng `aria-current`.
- Loading và error quan trọng phải được screen reader nhận biết.

---

## 11. TypeScript

- Bật strict mode.
- Không dùng `any` nếu không bắt buộc.
- Không dùng `ts-ignore` để che lỗi.
- Không ép kiểu thiếu an toàn.
- Request DTO và response DTO phải có type.
- Tách API DTO khỏi UI model nếu cấu trúc khác nhau.
- Dùng type guard khi dữ liệu không chắc chắn.
- Không khai báo cùng một type ở nhiều nơi.
- Ưu tiên union type khi phù hợp hơn enum.
- Không để TypeScript error tồn tại sau phase.

---

## 12. Component architecture

- Server Component là mặc định.
- Chỉ thêm `"use client"` tại boundary thực sự cần interaction, browser API hoặc React hooks phía client.
- Không biến toàn bộ page thành Client Component nếu không cần.
- Page component chủ yếu làm orchestration.
- Business logic nằm trong hooks hoặc feature modules.
- API logic không nằm trong UI component.
- Component phải có trách nhiệm rõ ràng.
- Không tạo component khổng lồ.
- Không tạo abstraction khi mới có một use case.
- Chỉ đưa component vào `shared` nếu thực sự dùng ở nhiều feature.
- Component đặc thù phải nằm trong feature tương ứng.
- Không để mỗi PostCard tự gọi lại API cho chính nó.

---

## 13. Cấu trúc thư mục mục tiêu

```text
src/
├── app/
│   ├── (auth)/
│   ├── (main)/
│   ├── layout.tsx
│   ├── providers.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   └── shared/
├── features/
│   ├── auth/
│   ├── feed/
│   ├── posts/
│   ├── profiles/
│   ├── social/
│   ├── search/
│   ├── notifications/
│   └── settings/
├── lib/
│   ├── api/
│   ├── query/
│   └── utils/
├── stores/
├── hooks/
├── config/
├── constants/
├── styles/
└── types/
```

Mỗi feature có thể gồm:

```text
feature-name/
├── api/
├── components/
├── hooks/
├── schemas/
├── types/
└── utils/
```

Không tạo thư mục rỗng cho feature chưa triển khai.

Không di chuyển hàng loạt file chỉ để làm cấu trúc đẹp hơn.

---

## 14. Quy tắc thay đổi code

Trước khi sửa:

1. Đọc cấu trúc repository.
2. Đọc file liên quan.
3. Đọc `AGENTS.md`.
4. Đọc phase hiện tại.
5. Kiểm tra git diff hiện tại.
6. Xác định code có thể tái sử dụng.

Không được:

- Viết lại toàn bộ dự án khi không cần.
- Đổi package manager.
- Sửa backend.
- Thay API contract.
- Refactor ngoài phạm vi.
- Xóa code đang hoạt động khi chưa hiểu.
- Cài dependency không sử dụng.
- Để `console.log` trong production code.
- Để dead code.
- Để TODO chung chung.
- Tự chuyển sang phase tiếp theo.

---

## 15. Testing và quality gates

Sau mỗi phase, bắt buộc chạy các lệnh phù hợp:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Nếu đã có E2E liên quan:

```bash
pnpm test:e2e
```

Nếu repository dùng npm hoặc yarn, dùng package manager hiện tại.

Không kết luận hoàn thành khi:

- Lint còn lỗi.
- Typecheck còn lỗi.
- Build còn lỗi.
- Test quan trọng còn fail.
- Có request loop.
- Có hydration mismatch.
- Có lỗi chức năng nghiêm trọng.

Nếu lỗi đã tồn tại trước phase, phải ghi rõ:

- Lỗi nào có sẵn.
- File liên quan.
- Lỗi có ngăn phase hoàn thành hay không.

---

## 16. Báo cáo sau mỗi phase

Cuối mỗi phase phải báo cáo:

1. Đã thực hiện những gì.
2. File quan trọng đã tạo hoặc thay đổi.
3. API endpoint đã tích hợp.
4. Quyết định kỹ thuật đáng chú ý.
5. Lệnh kiểm tra đã chạy.
6. Kết quả lint.
7. Kết quả typecheck.
8. Kết quả test.
9. Kết quả build.
10. Vấn đề còn tồn tại.
11. Blocker từ API.
12. Phase tiếp theo được đề xuất.

Phải cập nhật:

```text
docs/progress.md
```

Không tự bắt đầu phase tiếp theo.

---

## 17. Review checklist

Khi review thay đổi, phải tìm:

- Server state bị lưu trong Zustand.
- Query data bị sao chép sang global store.
- API logic nằm trong component.
- Query key thiếu ổn định.
- Request trùng.
- Mutation thiếu rollback.
- Cache không đồng bộ.
- Component quá lớn.
- `any`.
- `ts-ignore`.
- Unsafe cast.
- Màu hardcode.
- Spacing tùy ý lặp lại.
- Typography không thuộc scale.
- Radius không thống nhất.
- shadcn style mặc định không phù hợp.
- Theme bị lưu trong Zustand.
- Hydration mismatch.
- Flash theme sai.
- Hover state không rõ ở dark mode.
- Focus-visible không rõ.
- Accessibility issue.
- Responsive issue.
- Missing loading state.
- Missing empty state.
- Missing error state.
- Dependency không sử dụng.
- Import không sử dụng.
- `console.log`.
- Dead code.
- TODO chưa xử lý.