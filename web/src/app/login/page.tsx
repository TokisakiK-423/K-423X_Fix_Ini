"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as styles from "@/lib/styles/LoginStyles";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Pacifico&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json();
    if (!json.success) setError(json.message);
    else {
      localStorage.setItem("token", json.token);
      router.replace("/home");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={styles.title}>
          Login
          <img src="/img/xsa.png" style={styles.logo} />
        </h2>

        {error && <div style={styles.errorText}>{error}</div>}

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          required
          style={styles.input}
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          required
          style={styles.input}
        />

        <button
          type="submit"
          style={styles.primaryButton}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#6a1b9a")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#8e2de2")
          }
        >
          Login
        </button>

        <button
          type="button"
          style={styles.secondaryButton}
          onClick={() => router.push("/register")}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#e64a7f")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#ff6a95")
          }
        >
          Register
        </button>
      </form>
    </div>
  );
}
