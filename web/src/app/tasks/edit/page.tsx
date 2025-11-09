"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Task } from '@/lib/tasks';


export default function EditTaskPage() {
  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");

  useEffect(() => {
    if (!id) {
      setError("ID tugas tidak ditemukan");
      return;
    }
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/api/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(json => {
        if (!json.success) setError("Gagal ambil detail tugas");
        else setTask(json.task as Task);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!task || !id) return;
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    router.replace("/tasks");
  };

  return (
    <form onSubmit={handleSubmit} style={{maxWidth:420, margin:"auto", marginTop:50}}>
      <h2>Edit Tugas</h2>
      {error && <div style={{color:"red"}}>{error}</div>}
      {task && (
        <>
          <input
            value={task.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTask({ ...task, title: e.target.value })}
            placeholder="Judul"
            required
          />
          <input
            value={task.description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTask({ ...task, description: e.target.value })}
            placeholder="Deskripsi"
            required
          />
          <input
            value={task.date}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTask({ ...task, date: e.target.value })}
            type="date"
            required
          />
          <input
            value={task.time}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTask({ ...task, time: e.target.value })}
            type="time"
            required
          />
          <button type="submit">Update</button>
          <button type="button" onClick={() => router.push("/tasks")}>Batal</button>
        </>
      )}
    </form>
  );
}
