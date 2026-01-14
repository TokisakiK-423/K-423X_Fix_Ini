"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/tasks";           
import { styles } from "@/lib/styles/Add";
import toast from "react-hot-toast";
import TimePicker from "@/components/timepicker";

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
          toast.error("Tugas tidak ditemukan");
        }
      } catch {
        toast.error("Gagal mengambil detail tugas");
      }
    };
    fetchTask();
  }, [id]);

  const handleUpdate = async () => {
    if (!title || !description || !date || !time) {
      toast.error("Lengkapi semua data!");
      return;
    }

    const formattedTime = time.length === 5 ? time + ":00" : time;
    
    try {
      const res = await apiFetch(`/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify({ title, description, date, time :formattedTime  })
      });
      
      if (res.ok) {
        toast.success("Tugas berhasil diperbarui");
        router.replace("/home");
      } else {
        toast.error("Gagal memperbarui tugas");
      }
    } catch {
      toast.error("Gagal memperbarui tugas");
    }
  };

  const handleDelete = async () => {
    
    try {
      const res = await apiFetch(`/tasks/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Tugas berhasil dihapus", {
        style: {
          background: "#7c3aed",
          color: "#fff",
        },
      });
        router.replace("/home");
      } else {
        toast.error("Gagal menghapus tugas");
      }
    } catch {
      toast.error("Gagal menghapus tugas");
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
        <TimePicker value={time} onChange={setTime} />
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
