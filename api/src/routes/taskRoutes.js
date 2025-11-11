import express from "express";
import { getTasks, getTodayTasks, addTask } from "../controllers/taskController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import pool from "../db.js"; // tambahkan ini untuk koneksi PostgreSQL
import { completeTask } from '../controllers/taskController.js';

const router = express.Router();

// Semua route harus login
router.use(authMiddleware);

router.get("/", getTasks);
router.get("/today", getTodayTasks);
router.post("/", addTask);
router.patch('/:id/complete', completeTask);

// ✅ Ambil detail tugas berdasarkan ID
router.get("/:id", async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM tasks WHERE id = $1 AND user_id = $2",
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Tugas tidak ditemukan" });
    }

    res.json({ success: true, task: result.rows[0] });
  } catch (error) {
    console.error("❌ Error ambil detail tugas:", error);
    res.status(500).json({ success: false, message: "Gagal ambil detail tugas" });
  }
});

// ✅ Update tugas
router.put("/:id", async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;
    const { title, description, date, time, status } = req.body;

    const result = await pool.query(
      `UPDATE tasks 
       SET title=$1, description=$2, date=$3, time=$4, status=$5 
       WHERE id=$6 AND user_id=$7 
       RETURNING *`,
      [title, description, date, time, status, id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Tugas tidak ditemukan" });
    }

    res.json({ success: true, task: result.rows[0] });
  } catch (error) {
    console.error("❌ Error update tugas:", error);
    res.status(500).json({ success: false, message: "Gagal update tugas" });
  }
});

// ✅ Hapus tugas
router.delete("/:id", async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Tugas tidak ditemukan" });
    }

    res.json({ success: true, message: "Tugas berhasil dihapus" });
  } catch (error) {
    console.error("❌ Error hapus tugas:", error);
    res.status(500).json({ success: false, message: "Gagal hapus tugas" });
  }
});

export default router;
