"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  // Dynamically add Pacifico font link
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Pacifico&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #8e2de2, #ff6a95)",
        padding: "20px",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          maxWidth: 360,
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "30px 25px",
          borderRadius: 12,
          boxShadow: "0 8px 16px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <h2
          style={{
            fontFamily: "'Pacifico', cursive",
            fontSize: "2.5rem",
            color: "#8e2de2",
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          Login
        </h2>
        {error && (
          <div
            style={{
              color: "red",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            {error}
          </div>
        )}
        <input
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          type="email"
          placeholder="Email"
          required
          style={{
            padding: "12px 15px",
            fontSize: 16,
            borderRadius: 8,
            border: "1.5px solid #ccc",
            outlineColor: "#8e2de2",
          }}
        />
        <input
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          type="password"
          placeholder="Password"
          required
          style={{
            padding: "12px 15px",
            fontSize: 16,
            borderRadius: 8,
            border: "1.5px solid #ccc",
            outlineColor: "#8e2de2",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "12px",
            fontSize: 18,
            backgroundColor: "#8e2de2",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
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
          onClick={() => router.push("/register")}
          style={{
            padding: "12px",
            fontSize: 18,
            backgroundColor: "#ff6a95",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
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
