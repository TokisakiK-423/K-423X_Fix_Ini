import React, { useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Pacifico: require("../../assets/fonts/Pacifico-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data.success) {
        await AsyncStorage.setItem("token", res.data.token);
        await AsyncStorage.setItem("user", JSON.stringify(res.data.user));
        router.replace("/home");
      } else {
        Alert.alert("Login gagal", res.data.message || "Periksa email/password");
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", "Gagal login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#6a11cb", "#ff3366"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.title}>Masuk ke Taskify</Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button mode="contained" onPress={handleLogin} loading={loading} style={styles.button}>
        Login
      </Button>
      <Button onPress={() => router.push("/register")} style={{ marginTop: 10 }} labelStyle={{ color: "white" }}>
        Belum punya akun? Register
      </Button>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontFamily: "Pacifico",
    color: "white",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#8C1E7F",
  },
});
