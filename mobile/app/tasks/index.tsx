import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Button, Card } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import api from "../services/api";

export default function TasksPage() {
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getUser = async () => {
    try {
      const userStr = await AsyncStorage.getItem("user");
      if (userStr) setUser(JSON.parse(userStr));
    } catch (error) {
      console.error("Gagal ambil data user:", error);
    }
  };

  // ✅ Ambil semua tugas (bukan hanya hari ini)
  const getTasks = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "Token tidak ditemukan, silakan login ulang.");
        router.replace("/login");
        return;
      }

      console.log("Token ditemukan:", token);

      const res = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) setTasks(res.data.tasks || []);
      else Alert.alert("Error", "Gagal mengambil data tugas");
    } catch (err: any) {
      console.error("❌ Gagal ambil semua tugas:", err.response?.data || err.message);
      Alert.alert("Error", "Gagal mengambil semua tugas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
    getTasks();
  }, []);

  const handleEdit = (item: any) => {
    if (!item?.id) {
      Alert.alert("Error", "ID tugas tidak valid");
      return;
    }
    router.push(`/tasks/edit?id=${item.id}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Halo, {user?.email || "User"}</Text>

      <Button
        mode="contained"
        onPress={() => router.push("/tasks/add")}
        style={styles.button}
      >
        Tambah Tugas
      </Button>

      <Text style={styles.subtitle}>Daftar Semua Tugas</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#5e3ba2" />
      ) : tasks.length === 0 ? (
        <Text style={{ textAlign: "center" }}>Tidak ada tugas</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleEdit(item)}>
              <Card style={styles.card} elevation={2}>
                <Card.Content>
                  <Text style={styles.taskTitle}>{item.title}</Text>
                  <Text>{item.description}</Text>
                  <Text>
                    {item.date} {item.time?.slice(0, 5)}
                  </Text>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  subtitle: { fontSize: 18, fontWeight: "600", marginVertical: 8 },
  button: { marginBottom: 16, backgroundColor: "#5e3ba2" },
  card: { marginBottom: 10, borderRadius: 8 },
  taskTitle: { fontSize: 16, fontWeight: "bold" },
});
