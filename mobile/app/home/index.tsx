import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, FlatList } from "react-native";
import { Button, Card } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import api from "../services/api";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getUser = async () => {
    const userStr = await AsyncStorage.getItem("user");
    if (userStr) setUser(JSON.parse(userStr));
  };

  // ✅ Ambil semua tugas dari API
  const getAllTasks = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setAllTasks(res.data.tasks);
    } catch (err) {
      console.error("❌ Gagal ambil semua tugas:", err);
      Alert.alert("Error", "Gagal mengambil semua tugas");
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await getUser();
      await getAllTasks();
      setLoading(false);
    })();
  }, []);

  const renderTask = (item: any) => (
    <Card
      style={styles.taskCard}
      onPress={() => router.push(`/tasks/edit?id=${item.id}`)}
    >
      <Card.Content>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text>{item.description}</Text>
        <Text>{item.date} {item.time?.slice(0, 5)}</Text>
      </Card.Content>
    </Card>
  );

  const combinedData = [
    { type: "header", title: `Halo, ${user?.email}` },
    { type: "button" },
    { type: "subtitle", title: "Daftar Semua Tugas" },
    ...(allTasks.length > 0
      ? allTasks.map((t) => ({ ...t, type: "task" }))
      : [{ type: "empty", title: "Belum ada tugas" }]),
  ];

  return (
    <FlatList
      data={combinedData}
      keyExtractor={(_, index) => index.toString()}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => {
        if (item.type === "header") {
          return <Text style={styles.title}>{item.title}</Text>;
        } else if (item.type === "button") {
          return (
            <Button
              mode="contained"
              onPress={() => router.push("/tasks/add")}
              style={styles.button}
            >
              Tambah Tugas
            </Button>
          );
        } else if (item.type === "subtitle") {
          return <Text style={styles.subtitle}>{item.title}</Text>;
        } else if (item.type === "empty") {
          return <Text style={styles.emptyText}>{item.title}</Text>;
        } else {
          return renderTask(item);
        }
      }}
      ListEmptyComponent={<Text>Belum ada tugas</Text>}
      refreshing={loading}
      onRefresh={async () => {
        setLoading(true);
        await getAllTasks();
        setLoading(false);
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16, color: "#4B3EA0" },
  subtitle: { fontSize: 18, fontWeight: "600", marginVertical: 8 },
  button: { marginBottom: 16, backgroundColor: "#5e3ba2" },
  taskCard: { marginBottom: 10, backgroundColor: "#f9f9f9" },
  taskTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
  emptyText: { color: "#999", marginBottom: 10 },
});
