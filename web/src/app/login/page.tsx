"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { styles } from "@/lib/styles/LoginStyles";
import { apiFetch } from "@/lib/tasks";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
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

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>

        <h2 style={styles.title}>
          <span style={styles.titleText}>Login</span>
          <img src="/img/xsa.png" style={styles.logo} alt="Logo" />
        </h2>

        {error && <div style={styles.errorText}>{error}</div>}

        <input
          style={styles.input}
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          required
        />

        <input
          style={styles.input}
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          required
        />

        <button type="submit" style={styles.primaryButton}>Login</button>
        <button type="button" style={styles.secondaryButton}
          onClick={() => router.push("/register")}>
          Register
        </button>
      </form>
    </div>
  );
}
