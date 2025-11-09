"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

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

  return (
    <form onSubmit={handleRegister} style={{maxWidth: 350, margin: "60px auto"}}>
      <h2>Register</h2>
      {message && <div>{message}</div>}
      <input
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        type="email"
        placeholder="Email"
        required
      />
      <input
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
        required
      />
      <button type="submit">Register</button>
      <button type="button" onClick={() => router.push("/login")}>Login</button>
    </form>
  );
}
