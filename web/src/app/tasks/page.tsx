"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Task } from '@/lib/tasks';
import TimePicker from "@/components/timepicker";


export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    fetch("http://localhost:5000/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(json => {
        if (!json.success) setError("Gagal ambil tugas");
        else setTasks(json.tasks as Task[]);
      });
  }, [router]);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div style={{maxWidth:600, margin:"50px auto"}}>
      <h2>Daftar Tugas</h2>
      <button onClick={() => router.push("/tasks/add")}>Tambah Tugas</button>
      {error && <div style={{color:"red"}}>{error}</div>}
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <b>{task.title}</b> ({task.date} {task.time})
            <button onClick={() => router.push(`/tasks/edit?id=${task.id}`)}>Edit</button>
            <button onClick={() => handleDelete(task.id)}>Hapus</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
