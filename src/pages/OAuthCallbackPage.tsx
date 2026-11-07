import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchCurrentUser } from "../api/authApi";
import { useAuth } from "../features/auth/AuthContext";

// Backend (Spring Security success handler) cần redirect về đúng route này, ví dụ:
// http://localhost:5173/oauth/callback?accessToken=xxx&refreshToken=yyy
//
// Nếu bạn cấu hình backend trả token theo cách khác (ví dụ set cookie thay vì query
// param), sửa lại logic đọc token ở đây cho khớp.
export function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setError(`Backend trả lỗi: ${errorParam}`);
      return;
    }

    if (!accessToken || !refreshToken) {
      setError("Không nhận được token từ backend. Kiểm tra lại success handler ở Spring Security.");
      return;
    }

    localStorage.setItem("accessToken", accessToken);
    fetchCurrentUser()
      .then((user) => {
        setSession(accessToken, refreshToken, user);
        navigate("/", { replace: true });
      })
      .catch((err) => {
        console.error(err);
        setError("Token nhận được nhưng gọi /api/users/me thất bại — xem console để biết chi tiết.");
      });
  }, [searchParams, setSession, navigate]);

  return (
    <div style={{ maxWidth: 480, margin: "80px auto", textAlign: "center", fontFamily: "Inter, sans-serif" }}>
      {error ? (
        <>
          <p style={{ color: "#C0392B", fontWeight: 500 }}>Đăng nhập Google thất bại</p>
          <p style={{ fontSize: 13, color: "#6B6960" }}>{error}</p>
        </>
      ) : (
        <p style={{ color: "#6B6960" }}>Đang xử lý đăng nhập...</p>
      )}
    </div>
  );
}
