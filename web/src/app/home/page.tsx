"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.replace("/login");
    else {
      // Optional: decode JWT to get user info if needed
      // setUserEmail(emailFromToken);
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <div style={{textAlign:"center", marginTop:50}}>
      <h1>Dashboard Todo</h1>
      <button onClick={() => router.push("/tasks")}>Lihat Tugas</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
