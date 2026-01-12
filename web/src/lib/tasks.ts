export const API_BASE_URL = "http://localhost:5000/api";

export interface Task {
  id: number;
  title: string;
  description: string;
  date: string;
  time?: string;
  status: boolean;
}

export interface User {
  email: string;
}

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");
  return fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });
};
