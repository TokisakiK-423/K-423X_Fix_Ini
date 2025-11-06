// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, message: "Token tidak ditemukan" });
  }

  // Format: "Bearer <token>"
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Token tidak valid" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "RAHASIA");
    req.user = decoded; // tambahkan info user ke request
    next();
  } catch (err) {
    console.error("❌ Token error:", err);
    return res.status(401).json({ success: false, message: "Token tidak valid" });
  }
};
