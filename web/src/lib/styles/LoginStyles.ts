// lib/styles/LoginStyles.ts

import { CSSProperties } from "react";

export const container: CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #8e2de2, #ff6a95)",
  padding: "20px",
};

export const form: CSSProperties = {
  maxWidth: 360,
  width: "100%",
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  padding: "30px 25px",
  borderRadius: 12,
  boxShadow: "0 8px 16px rgba(0,0,0,0.25)",
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

export const title: CSSProperties = {
  fontFamily: "'Pacifico', cursive",
  fontSize: "2.5rem",
  color: "#8e2de2",
  textAlign: "center",
  marginBottom: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
};

export const logo: CSSProperties = {
  width: 100,
  height: 100,
  borderRadius: 8,
};

export const errorText: CSSProperties = {
  color: "red",
  fontWeight: "bold",
  textAlign: "center",
  marginBottom: 8,
};

export const input: CSSProperties = {
  padding: "12px 15px",
  fontSize: 16,
  borderRadius: 8,
  border: "1.5px solid #ccc",
  outlineColor: "#8e2de2",
};

export const primaryButton: CSSProperties = {
  padding: "12px",
  fontSize: 18,
  backgroundColor: "#8e2de2",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  transition: "background-color 0.3s",
};

export const secondaryButton: CSSProperties = {
  ...primaryButton,
  backgroundColor: "#ff6a95",
};
