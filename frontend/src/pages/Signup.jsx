import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo-transparent.png";
import Footer from "../components/Footer";
import { Eye, EyeOff } from "lucide-react";
import { GOOGLE_CLIENT_ID } from "../constants/google";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const googleBtnRef = useRef(null);

  const handleGoogleResponse = async (response) => {
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/google", { token: response.credential });
      login(res.data.access_token);
      const payload = JSON.parse(atob(res.data.access_token.split(".")[1]));
      navigate(payload.role === "admin" ? "/admin" : "/products");
    } catch (err) {
      setError(err.response?.data?.detail || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (window.google && googleBtnRef.current) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: "outline",
        size: "large",
        width: "100%",
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/signup", { email, password });
      login(res.data.access_token);
      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.detail || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <img src={logo} alt="The Cracker City" className="brand-logo" />
        <p className="brand-tagline">Light up every celebration.</p>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-wrap">
          <h1 className="auth-heading">Create your account</h1>
          <p className="auth-subheading">Sign up to start browsing and ordering.</p>

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
              <div className="password-wrap">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Creating account…" : "Sign up"}
            </button>
          </form>

          <div className="divider"><span>or</span></div>
          <div ref={googleBtnRef}></div>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Log in</Link>
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
          background: #FFFFFF;
        }

        .auth-visual {
          flex: 1;
          background: linear-gradient(160deg, #FFF6EC 0%, #FDEDE0 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          min-height: 100vh;
          padding: 40px;
        }

        .brand-logo {
          width: min(70%, 320px);
          height: auto;
        }

        .brand-tagline {
          margin-top: 16px;
          font-size: 15px;
          color: #7A7A85;
          text-align: center;
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
          background: #FFFFFF;
          color: #16161F;
          width: 100%;
        }

        .field input:focus {
          border-color: #E8794E;
        }

        .password-wrap {
          position: relative;
          display: flex;
        }

        .password-wrap input {
          flex: 1;
          padding-right: 44px;
        }

        .toggle-password {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          color: #6b6b7b;
        }

        .toggle-password:hover {
          color: #16161f;
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
          background: #E8794E;
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .auth-button:hover:not(:disabled) {
          background: #D9663B;
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

        .divider {
          display: flex;
          align-items: center;
          margin: 20px 0;
          color: #9a9aa5;
          font-size: 13px;
        }

        .divider::before, .divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: #e2e2e8;
        }

        .divider span {
          padding: 0 12px;
        }

        @media (max-width: 800px) {
          .auth-page { flex-direction: column; }
          .auth-visual { min-height: 260px; padding: 24px; }
          .brand-logo { width: 55%; }
        }
      `}</style>
    </div>
  );
}