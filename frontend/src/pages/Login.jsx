import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.jpeg";
import Footer from "../components/Footer";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);
  try {
    const res = await api.post("/auth/login", { email, password });
    login(res.data.access_token);

    // Decode role right after login to decide where to send them
    const payload = JSON.parse(atob(res.data.access_token.split(".")[1]));
    navigate(payload.role === "admin" ? "/admin" : "/products");
  } catch (err) {
    setError(err.response?.data?.detail || "Login failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <svg
          className="burst"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="200" cy="200" r="3" fill="#F5B942" />
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i / 16) * Math.PI * 2;
            const len = i % 2 === 0 ? 150 : 95;
            const x2 = 200 + Math.cos(angle) * len;
            const y2 = 200 + Math.sin(angle) * len;
            const colors = ["#F5B942", "#E8794E", "#F7D774"];
            return (
              <line
                key={i}
                x1="200"
                y1="200"
                x2={x2}
                y2={y2}
                stroke={colors[i % colors.length]}
                strokeWidth={i % 2 === 0 ? 2.5 : 1.5}
                strokeLinecap="round"
                opacity={i % 2 === 0 ? 0.9 : 0.55}
              />
            );
          })}
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i / 16) * Math.PI * 2;
            const len = i % 2 === 0 ? 150 : 95;
            const x2 = 200 + Math.cos(angle) * len;
            const y2 = 200 + Math.sin(angle) * len;
            return (
              <circle
                key={`dot-${i}`}
                cx={x2}
                cy={y2}
                r={i % 2 === 0 ? 3 : 2}
                fill="#F7D774"
              />
            );
          })}
        </svg>

        <div className="auth-visual-text">
  <img src={logo} alt="The Cracker City" className="brand-logo" />
  <p className="brand-tagline">Light up every celebration.</p>
</div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-wrap">
          <h1 className="auth-heading">Welcome back</h1>
          <p className="auth-subheading">Log in to keep browsing and ordering.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Logging in…" : "Log in"}
            </button>
          </form>

          <p className="auth-footer">
            No account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
         <Footer />
      <style>{`
        * { box-sizing: border-box; }

        .auth-page {
          min-height: 100vh;
          width: 100%;
          display: flex;
          font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
        }

        .auth-visual {
          flex: 1;
          background: radial-gradient(circle at 50% 42%, #1A1B3A 0%, #0E0F24 70%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          min-height: 100vh;
          padding: 40px;
        }

        .burst {
          width: min(70%, 420px);
          height: auto;
        }

        .auth-visual-text {
          margin-top: 24px;
          text-align: center;
        }

        .brand-mark {
          font-size: 30px;
          font-weight: 700;
          letter-spacing: 0.5px;
          color: #F7EFE0;
        }

        .brand-tagline {
          margin-top: 8px;
          font-size: 15px;
          color: #9A9AC0;
        }

        .auth-form-panel {
          flex: 1;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        .auth-form-wrap {
          width: 100%;
          max-width: 360px;
        }

        .auth-heading {
          font-size: 28px;
          font-weight: 700;
          color: #16161F;
          margin: 0 0 6px;
        }

        .auth-subheading {
          font-size: 15px;
          color: #6B6B7B;
          margin: 0 0 32px;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field label {
          font-size: 13px;
          font-weight: 600;
          color: #33333F;
        }

        .field input {
          padding: 12px 14px;
          font-size: 15px;
          border: 1.5px solid #E2E2E8;
          border-radius: 8px;
          outline: none;
          transition: border-color 0.15s ease;
          color: #16161F;
        }

        .field input:focus {
          border-color: #E8794E;
        }

        .auth-error {
          margin: 0;
          font-size: 14px;
          color: #C23A3A;
        }

        .auth-button {
          margin-top: 6px;
          padding: 12px 14px;
          font-size: 15px;
          font-weight: 600;
          background: #16161F;
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .auth-button:hover:not(:disabled) {
          background: #E8794E;
        }

        .auth-button:disabled {
          opacity: 0.6;
          cursor: default;
        }

        .auth-footer {
          margin-top: 24px;
          text-align: center;
          font-size: 14px;
          color: #6B6B7B;
        }

        .auth-footer a {
          color: #E8794E;
          font-weight: 600;
          text-decoration: none;
        }

        @media (max-width: 800px) {
          .auth-page { flex-direction: column; }
          .auth-visual { min-height: 260px; padding: 24px; }
          .burst { width: 45%; }
        }
        .brand-logo {
  max-width: 220px;
  width: 80%;
  height: auto;
}
      `}</style>
    </div>
  );
}