# Cấu hình backend cho luồng OAuth2 (Google)

> Tách ra từ README cũ của bản test OAuth. Giữ lại để tham khảo khi cấu hình Spring Security.

Project rút gọn, chỉ đủ để test luồng đăng nhập email/password và Google OAuth2 với backend Spring Boot. Chưa có feed/post/comment — sẽ bổ sung sau khi OAuth chạy ổn.

## Chạy project

```bash
npm install
cp .env.local.example .env.local   # rồi sửa lại URL nếu backend chạy port khác
npm run dev
```

Mở `http://localhost:5173`.

## Cách hoạt động

- `/login` — form email/password gọi `POST /api/auth/login`, và nút "Đăng nhập bằng Google" redirect sang backend.
- `/oauth/callback` — trang nhận lại token sau khi Google + Spring Security xử lý xong.
- `/` — hiển thị JSON của user hiện tại nếu đã đăng nhập, để bạn confirm trực quan token/session đúng.

## ⚠️ Việc BẮT BUỘC phải làm ở backend để 2 bên khớp nhau

Frontend này giả định backend redirect về kèm token qua query param. Đây là phần bạn cần tự cấu hình trong `SecurityConfig` của Spring Boot — mặc định Spring Security KHÔNG làm vậy, nó chỉ redirect về 1 URL cố định mà không gắn token.

Cần viết 1 `AuthenticationSuccessHandler` custom, redirect về:

```
http://localhost:5173/oauth/callback?accessToken=<jwt>&refreshToken=<refresh_token>
```

Ví dụ khung code (đặt trong `config/SecurityConfig.java` hoặc file riêng `OAuth2LoginSuccessHandler.java`):

```java
@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                         Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        // TODO: tìm/tạo user trong DB dựa trên oAuth2User.getAttributes() — xem oauth2-login-flow.md

        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String refreshToken = refreshTokenService.issue(user);

        String redirectUrl = UriComponentsBuilder
            .fromUriString("http://localhost:5173/oauth/callback")
            .queryParam("accessToken", accessToken)
            .queryParam("refreshToken", refreshToken)
            .build().toUriString();

        response.sendRedirect(redirectUrl);
    }
}
```

Và gắn vào `SecurityConfig`:

```java
http.oauth2Login(oauth2 -> oauth2
    .successHandler(oAuth2LoginSuccessHandler)
    .failureHandler((request, response, exception) ->
        response.sendRedirect("http://localhost:5173/oauth/callback?error=" + exception.getMessage()))
);
```

## CORS — lỗi hay gặp nhất khi test 2 project riêng biệt

Frontend chạy port `5173`, backend chạy port `8080` — khác origin, nên backend phải bật CORS cho phép `5173`, nếu không mọi request từ `LoginPage` sẽ bị block ở tầng trình duyệt (lỗi hiện trong Console, không phải Network tab).

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("http://localhost:5173"));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
}
```

## Checklist khi test không chạy được

- [ ] Backend đã chạy ở `http://localhost:8080` chưa (`.env.local` trỏ đúng port chưa)
- [ ] Google Cloud Console → Authorized redirect URIs đã có `http://localhost:8080/login/oauth2/code/google` chưa (đây là URL Spring Security tự expose, không phải URL frontend)
- [ ] CORS đã bật cho `localhost:5173` chưa
- [ ] `AuthenticationSuccessHandler` đã redirect kèm `accessToken`/`refreshToken` đúng format chưa — mở tab Network lúc redirect để xem query param thực tế
- [ ] Mở Console (F12) — mọi lỗi API đều log ra rõ ràng nhờ interceptor trong `src/api/client.ts`
