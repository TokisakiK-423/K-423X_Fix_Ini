"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Task, User, apiFetch } from "@/lib/tasks";
import { styles } from "@/lib/styles/HomeStyles";

export default function HomePage() {
  // Menyimpan data user, tugas, loading, dan error
  const [user, setUser] = useState<User | null>(null);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // Cek auth + load data 
  useEffect(() => {
    const checkAuthAndLoad = async () => {
      // Cek token login di localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login"); 
        return;
      }

      // data user dari localStorage
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          setUser(JSON.parse(userStr) as User); 
        } catch {
  
        }
      }

      // Fetch semua tugas dari API
      await fetchAllTasks(token);
      setLoading(false); 
    };
    checkAuthAndLoad();
  }, [router]); 

  // Mengambil semua tugas belum selesai dari API
  const fetchAllTasks = async (token: string) => {
    setLoading(true);    
    setError("");        
    try {
      // / API call ke /tasks endpoint
      const res = await apiFetch("/tasks");

      // / Handle HTTP error response
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

      // / Filter tugas BELUM SELSAI 
      const notCompletedTasks = tasks.filter((t: any) =>
        t.status === false ||      
        t.status === "false" ||    
        t.status === 0 ||         
        t.status === "0" ||        
        t.status === null ||       
        t.status === undefined     
      );
      setAllTasks(notCompletedTasks); 
    } catch (err) {
      setError("Gagal memuat tugas."); 
      setAllTasks([]);                 
    } finally {
      setLoading(false); 
    }
  };

  // / completeTask: Tandai tugas selesai + pindahkan dari list
  const completeTask = async (taskId: number) => {
    try {
      // Update status tugas jadi true
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

  // / Loading screen
  if (loading) return <div style={styles.loading}>Memuat tugas...</div>;

  return (
    <div style={styles.pageContainer}>
      {/* / salam user */}
      <div style={styles.greeting}>Halo, {user?.email || "User"}</div>

      {/* buat tugas */}
      <nav style={styles.menuBar}>
        <button onClick={() => router.push("/tasks/add")} style={styles.menuButton}>
          Tambah Tugas  
        </button>

        {/* halaman history tugas */}
        <button onClick={() => router.push("/riwayat")} style={styles.menuButton}>
          Riwayat       
        </button>

        {/* Logout */}
        <button onClick={() => router.push("/login")} style={styles.logoutButton}>
          Log Out       
        </button>
      </nav>

      {/* / Task section */}
      <section style={styles.taskSection}>
        <h3 style={styles.taskTitle}>Daftar Semua Tugas</h3>

        {/* / Error message */}
        {error && <p style={styles.error}>{error}</p>}
        
        {/* / Empty state */}
        {!error && allTasks.length === 0 && <p>Tidak ada tugas.</p>}

        {/* /  list */}
        <div style={styles.taskList}>
          {allTasks.map(task => (
            <div
              key={task.id}                          
              style={styles.taskCard}                 
              onClick={() => router.push(`/tasks/edit?id=${task.id}`)}  
            >
              <div> {/* isi  */}
                <div style={styles.taskTitleText}>{task.title}</div>     
                <div style={styles.taskDesc}>{task.description}</div>     
                <small style={styles.taskDate}>
                  {/* Format tanggal */}
                  {new Date(task.date).toISOString().slice(0, 10)}, {task.time?.slice(0, 5) || '00:00'}
                </small>
              </div>

              {/* tombol selesai*/}
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
