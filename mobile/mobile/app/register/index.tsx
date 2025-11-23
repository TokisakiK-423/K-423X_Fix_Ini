import React, { useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import api from "../services/api";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Load font Pacifico, path relatif dari folder register
  const [fontsLoaded] = useFonts({
    Pacifico: require("../../assets/fonts/Pacifico-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email dan password harus diisi");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/register", { email, password });
      if (res.data.success) {
        Alert.alert("Berhasil", "Akun dibuat, silahkan login", [
          { text: "OK", onPress: () => router.replace("/login") },
        ]);
      } else {
        Alert.alert("Gagal", res.data.message || "Register gagal");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Gagal register");
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
      <Text style={styles.title}>Daftar Taskify</Text>
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
      <Button mode="contained" onPress={handleRegister} loading={loading} style={styles.button}>
        Register
      </Button>
      <Button onPress={() => router.push("/login")} style={{ marginTop: 10 }} labelStyle={{ color: "white" }}>
        Sudah punya akun? Login
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
