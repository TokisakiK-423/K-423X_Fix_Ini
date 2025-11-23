"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success) {
          setTitle(json.task.title);
          setDescription(json.task.description);
          setDate(json.task.date);
          setTime(json.task.time);
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
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, date, time }),
      });
      if (res.ok) {
        alert("Tugas berhasil diperbarui");
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
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert("Tugas berhasil dihapus");
        router.replace("/home"); // Redirect ke home setelah hapus
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
        <input
          placeholder="Judul"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />
        <textarea
          placeholder="Deskripsi"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ ...styles.input, minHeight: 80 }}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={styles.input}
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleUpdate} style={{ ...styles.button, backgroundColor: "#5e3ba2", marginTop: 12 }}>
          Simpan Perubahan
        </button>
        <button onClick={handleDelete} style={{ ...styles.button, backgroundColor: "#d32f2f", marginTop: 8 }}>
          Hapus Tugas
        </button>
        <button onClick={() => router.replace("/home")} style={{ ...styles.button, backgroundColor: "#FC0FC0", marginTop: 8 }}>
          Batal
        </button>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  background: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "linear-gradient(135deg, #8e2de2, #ff6a95)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    boxSizing: "border-box",
  },
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
    maxWidth: 700,
    width: "100%",
    padding: 24,
    color: "white",
    boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    fontWeight: "700",
    fontSize: 22,
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "transparent",
    border: "1px solid rgba(255, 255, 255, 0.7)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: "white",
    outline: "none",
  },
  button: {
    border: "none",
    borderRadius: 8,
    color: "#fff",
    padding: 14,
    fontWeight: "bold",
    cursor: "pointer",
    width: "100%",
    fontSize: 16,
    transition: "background-color 0.3s ease",
  },
};
