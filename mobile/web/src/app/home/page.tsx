"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
        return;
      }
      const userStr = localStorage.getItem("user");
      if (userStr) setUser(JSON.parse(userStr));
      await fetchAllTasks(token);
      setLoading(false);
    };
    checkAuthAndLoad();
  }, []);

  const fetchAllTasks = async (token: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.replace("/login");
          return;
        } else {
          throw new Error("Fetch tasks failed");
        }
      }
      const json = await res.json();
      const tasks = json.tasks || [];
      const notCompletedTasks = tasks.filter(
        (t: any) =>
          t.status === false ||
          t.status === "false" ||
          t.status === 0 ||
          t.status === "0" ||
          t.status === null ||
          t.status === undefined
      );
      setAllTasks(notCompletedTasks);
    } catch (err) {
      setError("Gagal memuat tugas. Coba refresh halaman.");
      setAllTasks([]);
    }
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login");
  };

  const completeTask = async (taskId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
        return;
      }
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}/complete`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setAllTasks((prev) => prev.filter((t) => t.id !== taskId));
      } else {
        alert(json.message || "Gagal menyelesaikan tugas");
      }
    } catch {
      alert("Gagal menyelesaikan tugas");
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.greeting}>Halo, {user?.email || "User"}</div>

      <nav style={styles.menuBar}>
        <button onClick={() => router.push("/tasks/add")} style={styles.menuButton}>Tambah Tugas</button>
        <button onClick={() => router.push("/riwayat")} style={styles.menuButton}>Riwayat</button>
        <button onClick={logout} style={{ ...styles.menuButton, backgroundColor: "#ff6a95" }}>Log Out</button>
      </nav>

      <section style={styles.taskSection}>
        <h3 style={styles.taskTitle}>Daftar Semua Tugas</h3>

        {loading && <p>Memuat tugas...</p>}
        {error && <p style={{ color: "#ffb3b3" }}>{error}</p>}
        {!loading && allTasks.length === 0 && <p>Tidak ada tugas.</p>}

        <div style={styles.taskList}>
          {allTasks.map(task => (
            <div
              key={task.id}
              style={styles.taskCard}
              onClick={() => router.push(`/tasks/edit?id=${task.id}`)}
            >
              <div>
                <div style={{ fontSize: 16, fontWeight: "bold" }}>{task.title}</div>
                <div style={{ fontSize: 14, opacity: 0.8 }}>{task.description}</div>
                <small>{task.date} {task.time?.slice(0, 5)}</small>
              </div>

              <button
                onClick={e => {
                  e.stopPropagation();
                  completeTask(task.id);
                }}
                style={styles.checkBtn}
                aria-label="Selesaikan tugas"
              >
                ✓
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #8e2de2, #ff6a95)",
    color: "white",
    padding: 24,
    boxSizing: "border-box",
  },
  greeting: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
  },
  menuBar: {
    display: "flex",
    gap: 16,
    marginBottom: 24,
    paddingBottom: 12,
    borderBottom: "1px solid rgba(255,255,255,0.3)",
  },
  menuButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    border: "none",
    borderRadius: 8,
    padding: "8px 20px",
    cursor: "pointer",
    fontWeight: "bold",
    color: "white",
    transition: "background-color 0.3s ease",
  },
  taskSection: {
    maxWidth: 700,
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  taskTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 12,
  },
  taskList: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  taskCard: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 16,
    borderRadius: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  },
  checkBtn: {
    backgroundColor: "#4caf50",
    border: "none",
    borderRadius: 6,
    color: "white",
    padding: "6px 12px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
