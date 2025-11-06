import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import api from "../services/api";
import { useRouter } from "expo-router";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    <View style={styles.container}>
      <Text style={styles.title}>Register Taskify</Text>
      <TextInput label="Email" value={email} onChangeText={setEmail} style={styles.input} />
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
      <Button onPress={() => router.push("/login")} style={{ marginTop: 10 }}>
        Sudah punya akun? Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { marginBottom: 15, backgroundColor: "#fff" },
  button: { marginTop: 10, backgroundColor: "#a51c31" },
});
