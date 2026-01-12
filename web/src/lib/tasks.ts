export interface Task {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  status: boolean;
}

export interface User {
  email: string;
}

const API_BASE = "http://localhost:5000/api";

export const taskService = {
  // Fetch tasks yang belum selesai
  fetchAllTasks: async (token: string): Promise<Task[]> => {
    const res = await fetch(`${API_BASE}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (!res.ok) {
      if (res.status === 401) throw new Error("UNAUTHORIZED");
      throw new Error("FETCH_FAILED");
    }
    
    const json = await res.json();
    const tasks: Task[] = json.tasks || [];
    
    return tasks.filter(t => !t.status);
  },

  // Complete task
  completeTask: async (taskId: string, token: string): Promise<boolean> => {
    const res = await fetch(`${API_BASE}/tasks/${taskId}/complete`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    
    return res.ok;
  }
};
