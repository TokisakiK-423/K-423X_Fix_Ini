"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { styles } from "@/lib/styles/LoginStyles";
import { apiFetch } from "@/lib/tasks";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const validateForm = () => {
    const cleanEmail = email.trim();
    if (cleanEmail.includes(" ")) {
      setError("Email tidak boleh mengandung spasi");
      return false;
    }

    if (!cleanEmail.endsWith("@gmail.com")) {
      setError("Email harus berakhiran @gmail.com");
      return false;
    }

    if (password.length < 5) {
      setError("Password minimal 5 karakter");
      return false;
    }

    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setError("");

    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const json = await res.json();

      if (!json.success) setError(json.message);
      else {
        localStorage.setItem("token", json.token);
        router.replace("/home");
      }
    } catch {
      setError("Gagal login");
    }
  };
  const labelContainer: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: "600",
    color: "#8e2de2",
    margin: 0,
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={styles.title}>
          <span style={styles.titleText}>Login</span>
          <img src="/img/xsa.png" style={styles.logo} alt="Logo" />
        </h2>

        {error && (
          <div style={{ ...styles.errorText, color: "red" }}>
            {error}
          </div>
        )}

        <div style={labelContainer}>
          <label style={labelStyle}>Username</label>
          <input
            style={styles.input}
            value={email}
            onChange={e => setEmail(e.target.value.replace(/\s/g, ''))}
            onKeyDown={e => e.key === ' ' && e.preventDefault()}
            pattern="[a-zA-Z0-9._%+-]+@gmail\.com"
            type="email"
            placeholder="exsa@gmail.com"
            required
          />
        </div>

        <div style={labelContainer}>
          <label style={labelStyle}>Password</label>
          <input
            style={styles.input}
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            placeholder="Min 5 karakter"
            required
          />
        </div>
        <button type="submit" style={styles.primaryButton}>Login</button>
        <button
          type="button"
          style={styles.secondaryButton}
          onClick={() => router.push("/register")}
        >
          Register
        </button>
      </form>
    </div>
  );
}
