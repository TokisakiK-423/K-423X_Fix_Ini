"use client"; // <== Tambahkan ini di baris pertama

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return (
    <div style={{textAlign: "center", marginTop: 50}}>
      <h1>Selamat datang di aplikasi Todo!</h1>
      <p>Anda akan diarahkan ke halaman login...</p>
    </div>
  );
}
