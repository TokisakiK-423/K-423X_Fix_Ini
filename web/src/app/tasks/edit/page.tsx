"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/tasks";           
import { styles } from "@/lib/styles/Add";        

export default function EditTaskPage() {
  const params = useSearchParams();
  const id = params?.get("id");
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchTask = async () => {
      try {
        const res = await apiFetch(`/tasks/${id}`);  
        const json = await res.json();
        if (json.success) {
          setTitle(json.task.title);
          setDescription(json.task.description);
          setDate(json.task.date ? new Date(json.task.date).toISOString().slice(0, 10) : "");
          setTime(json.task.time || "");
        } else {
          alert("Tugas tidak ditemukan");
        }
      } catch {
        alert("Gagal mengambil detail tugas");
      }
    };
    fetchTask();
  }, [id]);

  const handleUpdate = async () => {
    if (!title || !description || !date || !time) {
      alert("Lengkapi semua data!");
      return;
    }
    
    try {
      const res = await apiFetch(`/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify({ title, description, date, time })
      });
      
      if (res.ok) {
        alert("Tugas berhasil diperbarui!");
        router.replace("/home");
      } else {
        alert("Gagal memperbarui tugas");
      }
    } catch {
      alert("Gagal memperbarui tugas");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus tugas ini?")) return;
    
    try {
      const res = await apiFetch(`/tasks/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Tugas berhasil dihapus!");
        router.replace("/home");
      } else {
        alert("Gagal menghapus tugas");
      }
    } catch {
      alert("Gagal menghapus tugas");
    }
  };

  return (
    <div style={styles.background}>
      <div style={styles.container}>
        <h2 style={styles.title}>Edit Tugas</h2>
        
        <input placeholder="Judul" value={title}
          onChange={e => setTitle(e.target.value)} style={styles.input} />
        <textarea placeholder="Deskripsi" value={description}
          onChange={e => setDescription(e.target.value)}
          style={{ ...styles.input, minHeight: 80 }} />
        <input type="date" value={date}
          onChange={e => setDate(e.target.value)} style={styles.input} />
        <input type="time" value={time}
          onChange={e => setTime(e.target.value)} style={styles.input} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={handleUpdate}
            style={{ ...styles.button, backgroundColor: "#5e3ba2", flex: 1 }}>
            Simpan Perubahan
          </button>
          <button onClick={handleDelete}
            style={{ ...styles.button, backgroundColor: "#d32f2f", flex: 1 }}>
            Hapus
          </button>
          <button onClick={() => router.replace("/home")}
            style={{ ...styles.button, backgroundColor: "#FC0FC0", flex: 1 }}>
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
