"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!username || !password) {
      alert("Username dan password wajib diisi.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/login", {
        username,
        password,
      });

      localStorage.setItem("token", response.data.access_token);

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Login gagal. Periksa kembali kredensial yang digunakan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-hero">
        <div>
          <div className="auth-hero__brand">
            <div className="auth-hero__badge">TF</div>
            <div>
              <strong>TaskFlow</strong>
              <p style={{ margin: 0, color: "rgba(226, 232, 240, 0.78)" }}>
                Task management.
              </p>
            </div>
          </div>

          <h1>Simple task management.</h1>
          <p>Login untuk masuk ke dashboard, task, user, dan chatbot.</p>
        </div>
      </section>

      <section className="auth-card">
        <form className="auth-panel" onSubmit={handleLogin}>
          <h2 className="auth-panel__title">Sign in</h2>
          <p className="auth-panel__subtitle">
            Demo login: <strong>venesa / 123456</strong>.
          </p>

          <div className="auth-grid">
            <label className="field">
              <span className="field__label">Username</span>
              <input
                className="input"
                type="text"
                placeholder="venesa"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>

            <label className="field">
              <span className="field__label">Password</span>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>

          <div className="helper-box" style={{ marginTop: 16 }}>
            <p className="helper-box__title">Info</p>
            <p className="helper-box__text">
              Data demo muncul otomatis saat backend berjalan.
            </p>
          </div>

          <div className="auth-actions" style={{ marginTop: 20 }}>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setUsername("venesa");
                setPassword("123456");
              }}
            >
              Fill demo
            </button>

            <button
              className="btn btn--primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
