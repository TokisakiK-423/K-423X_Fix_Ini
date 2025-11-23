import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";
import { Button, Card } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import api from "../services/api";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Home, Clock } from "lucide-react-native";

export default function RiwayatPage() {
  const [user, setUser] = useState<any>(null);
  const [completedTasks, setCompletedTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) router.replace("/login");
      await getUser();
      await getCompletedTasks();
      setLoading(false);
    };
    check();
  }, []);

  const getUser = async () => {
    const userStr = await AsyncStorage.getItem("user");
    if (userStr) setUser(JSON.parse(userStr));
  };

  const getCompletedTasks = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const list = res.data.tasks.map((t: any) => ({
          ...t,
          status: t.status === true || t.status === "true"
        }));

        setCompletedTasks(list.filter((t: any) => t.status === true));
      }
    } catch (err) {
      Alert.alert("Error", "Gagal mengambil riwayat tugas");
    }
  };

  const renderTask = (item: any) => (
    <Card style={styles.taskCard}>
      <Card.Content>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text>{item.description}</Text>
        <Text>{item.date} {item.time?.slice(0, 5)}</Text>
      </Card.Content>
    </Card>
  );

  const combinedData = [
    { type: "header", title: `Halo, ${user?.email}` },
    { type: "subtitle", title: "Riwayat Tugas Selesai" },
    ...(completedTasks.length > 0
      ? completedTasks.map((t) => ({ ...t, type: "task" }))
      : [{ type: "empty", title: "Belum ada tugas selesai" }]),
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#8e2de2" }}>
      <LinearGradient colors={["#8e2de2", "#ff0080"]} style={styles.gradientContainer}>
        <View style={{ flex: 1 }}>
          <FlatList
            data={combinedData}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={styles.container}
            renderItem={({ item }) => {
              if (item.type === "header") return <Text style={styles.title}>{item.title}</Text>;
              if (item.type === "subtitle") return <Text style={styles.subtitle}>{item.title}</Text>;
              if (item.type === "empty") return <Text style={styles.emptyText}>{item.title}</Text>;
              return renderTask(item);
            }}
            refreshing={loading}
            onRefresh={async () => {
              setLoading(true);
              await getCompletedTasks();
              setLoading(false);
            }}
          />

          <View style={styles.bottomButtons}>
            <Button icon={() => <Home color="#fff" width={20} height={20} />} mode="contained" onPress={() => router.replace("/")} style={styles.navButton}>Beranda</Button>
            <Button icon={() => <Clock color="#fff" width={20} height={20} />} mode="contained" onPress={() => router.push("/riwayat")} style={styles.navButton}>Riwayat</Button>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gradientContainer: { flex: 1 },
  container: { padding: 16, paddingBottom: 100 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16, color: "#fff", marginTop: 15 },
  subtitle: { fontSize: 18, fontWeight: "600", marginVertical: 8, color: "#fff" },
  taskCard: { marginBottom: 10, backgroundColor: "#f9f9f9" },
  taskTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
  emptyText: { color: "#ccc", marginBottom: 10 },
  bottomButtons: { position: "absolute", bottom: 0, left: 0, right: 0, flexDirection: "row", justifyContent: "space-around", backgroundColor: "#5e3ba2", paddingVertical: 10 },
  navButton: { flex: 1, marginHorizontal: 8 },
});
