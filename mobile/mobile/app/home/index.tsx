import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, FlatList, TouchableOpacity } from "react-native";
import { Button, Card } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import api from "../services/api";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, Home, Clock } from "lucide-react-native";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.replace("/login");
      } else {
        await getUser();
        await getAllTasks();
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const getUser = async () => {
    const userStr = await AsyncStorage.getItem("user");
    if (userStr) setUser(JSON.parse(userStr));
  };

  const getAllTasks = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await api.get("/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.data.success) setAllTasks(res.data.tasks.filter((task:any) => !task.status));
  } catch (err) {
    console.error("❌ Gagal ambil semua tugas:", err);
    Alert.alert("Error", "Gagal mengambil semua tugas");
  }
};


  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      router.replace("/login");
    } catch (error) {
      console.error("Gagal logout:", error);
      Alert.alert("Error", "Gagal logout, coba lagi");
    }
  };

  const completeTask = async (taskId: string) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await api.patch(
      `/tasks/${taskId}/complete`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.data.success) {
      Alert.alert("Sukses", "Tugas sudah selesai dan dipindahkan ke riwayat");
      getAllTasks();  // Refresh data di Home supaya hilang tugas selesai
    } else {
      Alert.alert("Error", "Gagal menyelesaikan tugas");
    }
  } catch (err) {
    console.error("Error menyelesaikan tugas:", err);
    Alert.alert("Error", "Gagal menyelesaikan tugas");
  }
};

  const renderTask = (item: any) => (
    <Card style={styles.taskCard} onPress={() => router.push(`/tasks/edit?id=${item.id}`)}>
      <Card.Content style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flex: 1, paddingRight: 10 }}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          <Text>{item.description}</Text>
          <Text>
            {item.date} {item.time?.slice(0, 5)}
          </Text>
        </View>
        <TouchableOpacity onPress={() => completeTask(item.id)}>
          <Check color="#34C759" width={24} height={24} />
        </TouchableOpacity>
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#8e2de2" }} edges={["bottom"]}>
      <LinearGradient colors={["#8e2de2", "#ff0080"]} style={styles.gradientContainer}>
        <View style={{ flex: 1 }}>
          <FlatList
            data={combinedData}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={styles.container}
            renderItem={({ item }) => {
              if (item.type === "header") {
                return <Text style={styles.title}>{item.title}</Text>;
              } else if (item.type === "button") {
                return (
                  <>
                    <View style={{ flex: 1 }}>
                      <Button mode="outlined" onPress={logout} style={styles.logoutButton} labelStyle={{ color: '#fff' }}>Log out</Button>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                      <Button mode="contained" onPress={() => router.push("/tasks/add")} style={styles.button}>Tambah Tugas</Button>
                    </View>
                  </>
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
            contentInset={{ bottom: 80 }}
          />

          <View style={styles.bottomButtons}>
            <Button
              icon={() => <Home color="#fff" width={20} height={20} />}
              mode="contained"
              onPress={() => router.replace("/")}
              style={styles.navButton}
            >Beranda</Button>
            <Button
              icon={() => <Clock color="#fff" width={20} height={20} />}
              mode="contained"
              onPress={() => router.push("/riwayat")}
              style={styles.navButton}
            >Riwayat</Button>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 100,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#fff",
    marginTop: 15,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 8,
    color: "#fff",
  },
  button: {
    marginBottom: 15,
    backgroundColor: "#5e3ba2",
    width: 200,
  },
  logoutButton: {
    marginBottom: 15,
    backgroundColor: "#FC0FC0",
    borderWidth: 1,
    width: 150,
  },
  taskCard: {
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  emptyText: {
    color: "#999",
    marginBottom: 10,
  },
  bottomButtons: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#5e3ba2",
    paddingVertical: 10,
  },
  navButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});
