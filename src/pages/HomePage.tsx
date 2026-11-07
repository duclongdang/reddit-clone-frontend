import { useAuth } from "../features/auth/AuthContext";

// Trang này chỉ để confirm trực quan: sau khi login (password hoặc Google), user
// hiện tại có đúng thông tin trả về từ /api/users/me không.
export function HomePage() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return <p style={{ textAlign: "center", marginTop: 60, color: "#6B6960" }}>Đang tải...</p>;
  }

  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: 60, fontFamily: "Inter, sans-serif" }}>
        <p style={{ color: "#6B6960" }}>Chưa đăng nhập.</p>
        <a href="/login" style={{ color: "#1F1F1F", fontWeight: 500 }}>
          Đến trang đăng nhập
        </a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: "60px auto", fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ fontSize: 20, fontWeight: 600 }}>Đăng nhập thành công ✓</h1>
      <pre
        style={{
          background: "#F4F2EA",
          border: "1px solid #E4E1D6",
          borderRadius: 8,
          padding: 16,
          fontSize: 13,
          fontFamily: "'IBM Plex Mono', monospace",
          overflowX: "auto",
        }}
      >
        {JSON.stringify(user, null, 2)}
      </pre>
      <button
        onClick={logout}
        style={{
          marginTop: 12,
          padding: "8px 14px",
          background: "none",
          border: "1px solid #D8D5C9",
          borderRadius: 6,
          fontSize: 13,
          cursor: "pointer",
        }}
      >
        Đăng xuất
      </button>
    </div>
  );
}
