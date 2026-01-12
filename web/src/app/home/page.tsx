"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Task, User, apiFetch } from "@/lib/tasks";
import { styles } from "@/lib/styles/HomeStyles";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
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
      if (userStr) {
        try {
          setUser(JSON.parse(userStr) as User);
        } catch {
        }
      }
      
      await fetchAllTasks(token);
      setLoading(false);
    };
    checkAuthAndLoad();
  }, [router]);

  const fetchAllTasks = async (token: string) => {
  setLoading(true);
  setError("");
  try {
    const res = await apiFetch("/tasks");  
    
    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.replace("/login");
        return;
      }
      throw new Error("Fetch tasks failed");
    }
    
    const json = await res.json();
    const tasks: Task[] = json.tasks || [];
    const notCompletedTasks = tasks.filter((t: any) =>
      t.status === false || t.status === "false" || t.status === 0 || 
      t.status === "0" || t.status === null || t.status === undefined
    );
    setAllTasks(notCompletedTasks);
  } catch (err) {
    setError("Gagal memuat tugas.");
    setAllTasks([]);
  } finally {
    setLoading(false);
  }
};


const completeTask = async (taskId: number) => {
  try {
    const res = await apiFetch(`/tasks/${taskId}/complete`, { 
      method: "PATCH" 
    }); 
    const json = await res.json();
    if (json.success) {
      setAllTasks(prev => prev.filter(t => t.id !== taskId));
    } else {
      alert(json.message || "Gagal menyelesaikan tugas");
    }
  } catch {
    alert("Gagal menyelesaikan tugas");
  }
};

  if (loading) return <div style={styles.loading}>Memuat tugas...</div>;

  return (
    <div style={styles.pageContainer}>
      <div style={styles.greeting}>Halo, {user?.email || "User"}</div>

      <nav style={styles.menuBar}>
        <button onClick={() => router.push("/tasks/add")} style={styles.menuButton}>
          Tambah Tugas
        </button>
        <button onClick={() => router.push("/riwayat")} style={styles.menuButton}>
          Riwayat
        </button>
        <button onClick={() => router.push("/login")} style={styles.logoutButton}>
          Log Out
        </button>
      </nav>

      <section style={styles.taskSection}>
        <h3 style={styles.taskTitle}>Daftar Semua Tugas</h3>

        {error && <p style={styles.error}>{error}</p>}
        {!error && allTasks.length === 0 && <p>Tidak ada tugas.</p>}

        <div style={styles.taskList}>
          {allTasks.map(task => (
            <div
              key={task.id}
              style={styles.taskCard}
              onClick={() => router.push(`/tasks/edit?id=${task.id}`)}
            >
              <div>
                <div style={styles.taskTitleText}>{task.title}</div>
                <div style={styles.taskDesc}>{task.description}</div>
                <small style={styles.taskDate}>
                  {task.date} {task.time?.slice(0, 5)}
                </small>
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

