"use client";
import { useState } from "react";

type Props = {
  value: string;
  onChange: (val: string) => void;
};

export default function TimePicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const [hour, setHour] = useState(value.split(":")[0] || "00");
  const [minute, setMinute] = useState(value.split(":")[1] || "00");

  const saveTime = () => {
    onChange(`${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`);
    setOpen(false);
  };

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        style={{
          border: "1px solid #ccc",
          padding: 12,
          borderRadius: 8,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer"
        }}
      >
        <span>{value || "Pilih jam"}</span>
        <span>⏰</span>
      </div>

      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 12
            }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {/* JAM */}
              <select
                value={hour}
                onChange={e => setHour(e.target.value)}
                style={{
                  fontSize: 20,
                  padding: 10,
                  borderRadius: 8,
                  color: "#000",
                  background: "#fff",
                  border: "1px solid #ccc"
                }}
              >
                {Array.from({ length: 24 }).map((_, i) => (
                  <option key={i} value={String(i).padStart(2, "0")}>
                    {String(i).padStart(2, "0")}
                  </option>
                ))}
              </select>

              <span style={{ fontSize: 20 }}>:</span>

              {/* MENIT */}
              <select
                value={minute}
                onChange={e => setMinute(e.target.value)}
                style={{
                  fontSize: 20,
                  padding: 10,
                  borderRadius: 8,
                  color: "#000",
                  background: "#fff",
                  border: "1px solid #ccc"
                }}
              >
                {Array.from({ length: 60 }).map((_, i) => (
                  <option key={i} value={String(i).padStart(2, "0")}>
                    {String(i).padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={saveTime}
              style={{
                marginTop: 12,
                padding: "8px 16px",
                borderRadius: 8,
                background: "#5e3ba2",
                color: "#fff",
                border: "none"
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
