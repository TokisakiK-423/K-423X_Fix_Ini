import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function IndexPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        console.log("Token ditemukan:", token);

        // Tambahkan delay sedikit supaya efek loading sempat muncul
        setTimeout(() => {
          if (token) {
            router.replace("/home");
            // Sudah login
          } else {
            router.replace("/login"); ; // Belum login
          }
          setLoading(false);
        }, 700);
      } catch (error) {
        console.error("Gagal memeriksa token:", error);
        router.replace("/login");
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#a51c31" />
        <Text style={{ marginTop: 10, color: "#a51c31" }}>Memeriksa sesi login...</Text>
      </View>
    );
  }

  return null;
}
