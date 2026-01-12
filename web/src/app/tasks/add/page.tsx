"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/tasks";        
import { styles } from "@/lib/styles/Add";     

export default function AddTask() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const handleSave = async () => {
    if (!title || !description || !date || !time) {
      alert("Lengkapi semua data!");
      return;
    }
    try {
      const res = await apiFetch("/tasks", { 
        method: "POST",
        body: JSON.stringify({ title, description, date, time })
      });

      if (res.ok) {
        alert("Tugas berhasil ditambahkan!");
        router.push("/home");
      } else {
        const json = await res.json();
        alert(json.message || "Gagal menambahkan tugas!");
      }
    } catch {
      alert("Gagal menambahkan tugas!");
    }
  };

  return (
    <div style={styles.background}>
      <div style={styles.container}>
        <h2 style={styles.title}>Tambah Tugas</h2>
         <input
          placeholder="Judul Tugas" value={title}
          onChange={e => setTitle(e.target.value)}
          style={styles.input}
        />
        <textarea
          placeholder="Deskripsi" value={description}
          onChange={e => setDescription(e.target.value)}
          style={{ ...styles.input, minHeight: 80 }}
        />
        <input type="date" value={date}
          onChange={e => setDate(e.target.value)}
          style={styles.input}
        />
        <input type="time" value={time}
          onChange={e => setTime(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleSave}
          style={{ ...styles.button, backgroundColor: "#5e3ba2", marginTop: 12 }}>
          Simpan
        </button>
        <button onClick={() => router.replace("/home")}
          style={{ ...styles.button, backgroundColor: "#FC0FC0", marginTop: 8 }}>
          Batal
        </button>
      </div>
    </div>
  );
}
