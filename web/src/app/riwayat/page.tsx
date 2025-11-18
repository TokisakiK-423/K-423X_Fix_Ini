"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RiwayatPage() {
  const [user, setUser] = useState<any>(null);
  const [completedTasks, setCompletedTasks] = useState<any[]>([]);
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
      await fetchCompletedTasks(token);
      setLoading(false);
    };
    checkAuthAndLoad();
  }, []);

  const fetchCompletedTasks = async (token: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Fetch failed");
      const json = await res.json();
      const tasks = json.tasks || [];
      const completed = tasks.filter(
        (t: any) =>
          t.status === true ||
          t.status === "true" ||
          t.status === 1 ||
          t.status === "1"
      );
      setCompletedTasks(completed);
    } catch {
      setError("Gagal mengambil riwayat tugas");
      setCompletedTasks([]);
    }
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login");
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.greeting}>Halo, {user?.email || "User"}</div>

      <nav style={styles.menuBar}>
        <button onClick={() => router.push("/tasks/add")} style={styles.menuButton}>
          Tambah Tugas
        </button>
        <button onClick={() => router.push("/home")} style={styles.menuButton}>
          Beranda
        </button>
        <button onClick={logout} style={{ ...styles.menuButton, backgroundColor: "#ff6a95" }}>
          Log Out
        </button>
      </nav>

      <section style={styles.taskSection}>
        <h3 style={styles.taskTitle}>Riwayat Tugas Selesai</h3>

        {loading && <p>Memuat riwayat tugas...</p>}
        {error && <p style={{ color: "#ffb3b3" }}>{error}</p>}
        {!loading && completedTasks.length === 0 && <p>Belum ada tugas selesai</p>}

        <div style={styles.taskList}>
          {completedTasks.map((task) => (
            <div key={task.id} style={styles.taskCard}>
              <h4 style={{ 
                margin: 0, 
                textDecoration: 'line-through', 
                color: 'white' 
              }}>
                {task.title}
              </h4>
              <p style={{ 
                textDecoration: 'line-through', 
                color: 'white',
                marginTop: 4,
                marginBottom: 8,
              }}>
                {task.description}
              </p>
              <small style={{ color: 'white' }}>
                {task.date} {task.time?.slice(0, 5)}
              </small>
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
    boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
  },
};
