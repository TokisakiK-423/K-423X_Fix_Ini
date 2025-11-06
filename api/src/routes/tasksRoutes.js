import express from "express";
import { getTasks, getTodayTasks, addTask, getTaskById } from "../controllers/taskController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Semua route harus login
router.use(authMiddleware);

router.get("/", getTasks);          // Ambil semua tugas
router.get("/today", getTodayTasks); // Ambil tugas hari ini
router.get("/:id", getTaskById);     // 🔥 Ambil detail tugas
router.post("/", addTask);           // Tambah tugas baru

export default router;
