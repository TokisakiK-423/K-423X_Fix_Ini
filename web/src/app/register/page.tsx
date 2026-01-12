"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Pacifico&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!json.success) setMessage("Registrasi gagal: " + json.message);
    else {
      setMessage("Registrasi sukses! Silakan login.");
      setTimeout(() => router.replace("/login"), 1500);
    }
  };

  const isError = message.startsWith("Registrasi gagal");

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
        onSubmit={handleRegister}
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px"
          }}
        >
          Register
          <img
            src="/img/xsa.png" style={{
              width: 100,
              height: 100,
              borderRadius: 8
            }}
          />
        </h2>
        {message && (
          <div
            style={{
              color: isError ? "red" : "green",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            {message}
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
          Register
        </button>
        <button
          type="button"
          onClick={() => router.push("/login")}
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
          Login
        </button>
      </form>
    </div>
  );
}
