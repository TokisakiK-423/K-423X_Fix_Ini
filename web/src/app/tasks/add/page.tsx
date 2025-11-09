"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddTaskPage() {
  const [title, setTitle] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, description: desc, date, time }),
    });
    router.replace("/tasks");
  };

  return (
    <form onSubmit={handleSubmit} style={{maxWidth:400, margin:"auto", marginTop:50}}>
      <h2>Tambah Tugas</h2>
      <input
        value={title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
        placeholder="Judul"
        required
      />
      <input
        value={desc}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDesc(e.target.value)}
        placeholder="Deskripsi"
        required
      />
      <input
        value={date}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
        type="date"
        required
      />
      <input
        value={time}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTime(e.target.value)}
        type="time"
        required
      />
      <button type="submit">Simpan</button>
      <button type="button" onClick={() => router.push("/tasks")}>Batal</button>
    </form>
  );
}
