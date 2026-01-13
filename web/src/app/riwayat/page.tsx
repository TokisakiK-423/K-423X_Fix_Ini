"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Task, User, apiFetch } from "@/lib/tasks";  // ← REUSE
import { styles as homeStyles, styles } from "@/lib/styles/HomeStyles";  // ← REUSE

export default function RiwayatPage() {
  // Sama seperti HomePage
  const [user, setUser] = useState<User | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const displayName = user?.email?.split("@")[0];

  // Sama seperti HomePage
  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const token = localStorage.getItem("token");
      if (!token) return router.replace("/login");

      const userStr = localStorage.getItem("user");
      if (userStr) setUser(JSON.parse(userStr) as User);

      await fetchCompletedTasks();
      setLoading(false);
    };
    checkAuthAndLoad();
  }, [router]);

  // Filter TUGAS SELESAI vs HomePage: BELUM SELESAI
  const fetchCompletedTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/tasks");  

      if (!res.ok) throw new Error("Fetch failed");

      const json = await res.json();
      const tasks: Task[] = json.tasks || [];

      // / Filter TUGAS SELESAI (kebalikan HomePage)
      const completedTasks = tasks.filter((t: any) =>
        t.status === true || t.status === "true" || 
        t.status === 1 || t.status === "1"
      );
      setCompletedTasks(completedTasks);
    } catch {
      setError("Gagal mengambil riwayat tugas");
      setCompletedTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login");
  };

  if (loading) return <div style={homeStyles.loading}>Memuat riwayat...</div>;

  return (
    <div style={homeStyles.pageContainer}>
      <div style={styles.greeting}>Halo, {displayName || "User"}</div>
      {/* Nav - ganti "Riwayat" jadi "Beranda" */}
      <nav style={homeStyles.menuBar}>
        {/* halaman history tugas */}
        <button onClick={() => router.push("/home")} style={styles.menuButton}>
          Beranda       
        </button>
        {/* Logout */}
        <button onClick={() => router.push("/login")} style={styles.logoutButton}>
          Log Out       
        </button>
      </nav>

      {/* / section */}
      <section style={homeStyles.taskSection}>
        <h3 style={homeStyles.taskTitle}>Riwayat Tugas Selesai</h3>

        {error && <p style={homeStyles.error}>{error}</p>}
        {!error && completedTasks.length === 0 && <p>Belum ada tugas selesai</p>}

        <div style={homeStyles.taskList}>
          {completedTasks.map(task => (
            <div key={task.id} style={homeStyles.taskCard}>
              {/* / untuk tugas selesai */}
              <div style={homeStyles.strikethroughText}>
                <div style={homeStyles.taskTitleText}>{task.title}</div>
                <div style={homeStyles.taskDesc}>{task.description}</div>
                {/* / Format date sama seperti HomePage */}
                <small style={homeStyles.taskDate}>
                  {new Date(task.date).toISOString().slice(0, 10)}, {task.time?.slice(0, 5) || '00:00'}
                </small>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
