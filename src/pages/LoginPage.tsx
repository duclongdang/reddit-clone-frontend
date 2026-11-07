import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authApi";
import { useAuth } from "../features/auth/AuthContext";
import { GoogleLoginButton } from "../features/auth/components/GoogleLoginButton";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setSession } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      const result = await login({ email, password });
      setSession(result.accessToken, result.refreshToken, result.user);
      navigate("/");
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.error?.message ?? "Đăng nhập thất bại, kiểm tra console.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: 380,
        margin: "60px auto",
        padding: "0 16px",
        fontFamily: "Inter, sans-serif",
        color: "#1F1F1F",
      }}
    >
      <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>Đăng nhập</h1>
      <p style={{ fontSize: 13, color: "#6B6960", marginBottom: 24 }}>
        Project test cho luồng OAuth2 — form email/password gọi thẳng{" "}
        <code>/api/auth/login</code>.
      </p>

      <GoogleLoginButton />

      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0" }}>
        <div style={{ flex: 1, height: 1, background: "#E4E1D6" }} />
        <span style={{ fontSize: 12, color: "#9B9890" }}>hoặc</span>
        <div style={{ flex: 1, height: 1, background: "#E4E1D6" }} />
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />
        {errorMsg && <p style={{ color: "#C0392B", fontSize: 13, margin: 0 }}>{errorMsg}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: "10px 16px",
            background: "#1F1F1F",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  border: "1px solid #D8D5C9",
  borderRadius: 6,
  fontSize: 14,
  fontFamily: "inherit",
};
