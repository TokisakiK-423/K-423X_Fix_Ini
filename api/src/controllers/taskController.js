import pool from "../db.js";

// Tambah tugas
export const addTask = async (req, res) => {
  const { title, description, date, time } = req.body;
  const user_id = req.user?.id;

  if (!user_id) {
    return res.status(401).json({ success: false, message: "Token tidak valid" });
  }

  if (!title || !description || !date || !time) {
    return res.status(400).json({ success: false, message: "Semua field wajib diisi" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO tasks (user_id, title, description, date, time, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
      [user_id, title, description, date, time, false]
    );

    res.json({ success: true, task: result.rows[0] });
  } catch (err) {
    console.error("❌ Error menambah tugas:", err);
    res.status(500).json({ success: false, message: "Gagal menambahkan tugas" });
  }
};

// Ambil semua tugas user
export const getTasks = async (req, res) => {
  const user_id = req.user?.id;

  if (!user_id) {
    return res.status(401).json({ success: false, message: "Token tidak valid" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM tasks WHERE user_id=$1 ORDER BY date, time",
      [user_id]
    );
    res.json({ success: true, tasks: result.rows });
  } catch (err) {
    console.error("❌ Error ambil semua tugas:", err);
    res.status(500).json({ success: false, message: "Gagal mengambil tugas" });
  }
};

// Ambil tugas hari ini
export const getTodayTasks = async (req, res) => {
  const user_id = req.user?.id;

  if (!user_id) {
    return res.status(401).json({ success: false, message: "Token tidak valid" });
  }

  const today = new Date().toISOString().split("T")[0]; // format YYYY-MM-DD

  try {
    const result = await pool.query(
      "SELECT * FROM tasks WHERE user_id=$1 AND date=$2 ORDER BY time",
      [user_id, today]
    );
    res.json({ success: true, tasks: result.rows });
  } catch (err) {
    console.error("❌ Error ambil tugas hari ini:", err);
    res.status(500).json({ success: false, message: "Gagal mengambil tugas hari ini" });
  }
};

// Ambil detail tugas berdasarkan ID
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [task] = await req.db.query(
      "SELECT * FROM tasks WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (!task) {
      return res.status(404).json({ success: false, message: "Tugas tidak ditemukan" });
    }

    res.json({ success: true, task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal mengambil detail tugas" });
  }
};
export const completeTask = async (req, res) => {
  const user_id = req.user.id;
  const { id } = req.params;

  try {
    const result = await pool.query(
      "UPDATE tasks SET status = true WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, user_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Tugas tidak ditemukan" });
    }
    res.json({ success: true, message: "Tugas berhasil diselesaikan", task: result.rows[0] });
  } catch (error) {
    console.error("❌ Error menyelesaikan tugas:", error);
    res.status(500).json({ success: false, message: "Gagal menyelesaikan tugas" });
  }
};

