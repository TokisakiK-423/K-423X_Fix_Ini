"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { styles } from "@/lib/styles/LoginStyles"; 
import { apiFetch } from "@/lib/tasks";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      
      if (!json.success) {
        setMessage("Registrasi gagal: " + json.message);
      } else {
        setMessage("Registrasi sukses! Silakan login.");
        setTimeout(() => router.replace("/login"), 1500);
      }
    } catch {
      setMessage("Gagal registrasi");
    }
  };

  const isError = message.startsWith("Registrasi gagal");

  return (
    <div style={styles.container}>
      <form onSubmit={handleRegister} style={styles.form}>
        <h2 style={styles.title}>
          <span style={styles.titleText}>Register</span>
          <img src="/img/xsa.png" style={styles.logo} alt="Logo" />
        </h2>
        
        {message && (
          <div style={{ ...styles.errorText, color: isError ? "red" : "green" }}>
            {message}
          </div>
        )}
        
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
        
        <button type="submit" style={styles.primaryButton}>Register</button>
        <button
          type="button"
          style={styles.secondaryButton}
          onClick={() => router.push("/login")}
        >
          Login
        </button>
      </form>
    </div>
  );
}
