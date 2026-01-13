
export const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #8e2de2, #ff6a95)",
    color: "white",
    padding: 24,
    boxSizing: "border-box",
  },
  strikethroughText: {
  textDecoration: 'line-through',
  opacity: 0.7,
},
  logoutButton: {
    border: "none",
    borderRadius: 8,
    padding: "8px 20px",
    cursor: "pointer",
    fontWeight: "bold",
    color: "white",
    transition: "background-color 0.3s ease",
    backgroundColor: "#ff6a95"  
  },
  greeting: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
  },
  menuBar: {
    display: "flex",
    gap: 16,
    marginTop: 35,
    marginBottom: 24,
    paddingBottom: 12,
    borderBottom: "1px solid rgba(255,255,255,0.3)",
  },
  menuButton: {
    backgroundColor: "#4ade80",
    border: "none",
    borderRadius: 8,
    padding: "8px 20px",
    cursor: "pointer",
    fontWeight: "bold",
    color: "white",
    transition: "background-color 0.3s ease",
  },
  taskSection: {
    maxWidth: 700,
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    margin: "0 auto 0 0",
  },
  taskTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 12,
  },
  taskList: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  taskCard: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 16,
    borderRadius: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  },
  checkBtn: {
    backgroundColor: "#4caf50",
    border: "none",
    borderRadius: 6,
    color: "white",
    padding: "6px 12px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};



