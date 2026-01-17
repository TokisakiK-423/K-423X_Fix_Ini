import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Platform, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import api from "../services/api"; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddTask() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // fungsi simpan data
  const handleSave = async () => {
    if (!title || !description || !date || !time) {
      Alert.alert("Peringatan", "Lengkapi semua data terlebih dahulu!");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      const formattedDate = date.toISOString().split("T")[0];
      const formattedTime = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      console.log("Kirim:", {
        title,
        description,
        date: formattedDate,
        time: formattedTime,
        token,
      });

      const res = await api.post(
        "/tasks",
        {
          title,
          description,
          date: formattedDate,
          time: formattedTime,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Response:", res.data);
      Alert.alert("Sukses", "Tugas berhasil ditambahkan!");
      router.push("/");
    } catch (error: any) {
      console.error("Axios error:", error);
      Alert.alert("Error", error.response?.data?.message || "Gagal menambahkan tugas!");
    }
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) setDate(selectedDate);
  };

  const onChangeTime = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selectedTime) setTime(selectedTime);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient 
        colors={["#8e2de2", "#ff0080"]} 
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Title - PUTIH */}
          <Text style={styles.title}>Tambah Tugas</Text>

          {/* Input Judul - TEXT PUTIH */}
          <TextInput
            placeholder="Judul Tugas"
            placeholderTextColor="#8e2de2"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          {/* Input Deskripsi - TEXT PUTIH */}
          <TextInput
            placeholder="Deskripsi"
            placeholderTextColor="#8e2de2"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            style={[styles.input, styles.textArea]}
          />

          {/* Tombol Tanggal - TEXT PUTIH */}
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.dateButton}
          >
            <Text style={styles.buttonText}>
              {date ? date.toLocaleDateString("id-ID") : "Pilih Tanggal"}
            </Text>
          </TouchableOpacity>

          {/* Tombol Waktu - TEXT PUTIH */}
          <TouchableOpacity
            onPress={() => setShowTimePicker(true)}
            style={styles.dateButton}
          >
            <Text style={styles.buttonText}>
              {time ? time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Pilih Waktu"}
            </Text>
          </TouchableOpacity>

          {/* Tombol Simpan - TEXT PUTIH */}
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Simpan Tugas</Text>
          </TouchableOpacity>

          {/* Date Picker */}
          {showDatePicker && (
            <DateTimePicker
              value={date || new Date()}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}

          {/* Time Picker */}
          {showTimePicker   && (
            <DateTimePicker
              value={time || new Date()}
              mode="time"
              display="default"
              onChange={onChangeTime}
            />
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 30,
    color: "#FFFFFF", // PUTIH
  },
  input: {
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    color: "#8e2de2", // TEXT PUTIH
    fontSize: 16,
  },
  textArea: {
    textAlignVertical: "top",
    minHeight: 90,
    marginBottom: 20,
  },
  dateButton: {
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#FC0FC0",
  },
  buttonText: {
    color: "#FFFFFF", // TEXT PUTIH
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#FC0FC0",
    borderRadius: 15,
    padding: 18,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonText: {
    color: "#FFFFFF", // TEXT PUTIH
    fontWeight: "bold",
    fontSize: 18,
  },
});
