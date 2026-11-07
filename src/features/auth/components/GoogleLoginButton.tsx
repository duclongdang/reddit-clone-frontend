// Cách đơn giản nhất để test OAuth2 với Spring Security: KHÔNG dùng Google SDK ở
// frontend. Chỉ cần redirect trình duyệt sang endpoint Spring Security tự expose
// (/oauth2/authorization/google), Spring lo toàn bộ phần trao đổi với Google.
// Sau khi xong, Spring Security redirect ngược lại frontend kèm token (xem OAuthCallbackPage).
export function GoogleLoginButton() {
  const googleLoginUrl = import.meta.env.VITE_GOOGLE_LOGIN_URL || "http://localhost:8080/oauth2/authorization/google";

  function handleClick() {
    if (!googleLoginUrl) {
      window.alert("Thiếu cấu hình VITE_GOOGLE_LOGIN_URL. Hãy kiểm tra file .env.local.");
      return;
    }

    window.location.assign(googleLoginUrl);
  }

  return (
    <button
      onClick={handleClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: "10px 16px",
        background: "#fff",
        color: "#1F1F1F",
        border: "1px solid #D8D5C9",
        borderRadius: 6,
        fontSize: 14,
        fontWeight: 500,
        cursor: "pointer",
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"
        />
        <path
          fill="#34A853"
          d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.9v2.33A9 9 0 0 0 9 18z"
        />
        <path
          fill="#FBBC05"
          d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.9A9 9 0 0 0 0 9c0 1.45.35 2.83.9 4.05l3.07-2.33z"
        />
        <path
          fill="#EA4335"
          d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .9 4.95l3.07 2.33C4.68 5.16 6.66 3.58 9 3.58z"
        />
      </svg>
      Đăng nhập bằng Google
    </button>
  );
}
