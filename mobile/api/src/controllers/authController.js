import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [email, hash]
    );
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal register" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ success: false, message: "User tidak ditemukan" });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ success: false, message: "Password salah" });

    // PENTING: gunakan secret dari .env supaya token bisa diverifikasi
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET, // <-- ini diganti dari "RAHASIA"
      { expiresIn: "1d" }
    );

    res.json({ success: true, token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal login" });
  }
};
