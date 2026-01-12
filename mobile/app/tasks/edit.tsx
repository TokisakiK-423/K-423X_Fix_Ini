import React, { useEffect, useState } from "react";
import { View, TextInput, Text, Alert, Platform, StyleSheet, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../services/api";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditTaskPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  // Fetch task detail by ID
  useEffect(() => {
    const fetchTaskDetail = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await api.get(`/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          const t = response.data.task;
          setTitle(t.title);
          setDescription(t.description);
          setDate(new Date(t.date));
          setTime(new Date(`1970-01-01T${t.time}`));
        } else {
          Alert.alert("Gagal", "Data tugas tidak ditemukan");
        }
      } catch (error) {
        console.error("❌ Gagal ambil detail tugas:", error);
        Alert.alert("Error", "Gagal ambil detail tugas!");
      }
    };

    fetchTaskDetail();
  }, [id]);

  // Update task handler
  const handleUpdate = async () => {
    if (!title || !description || !date || !time) {
      Alert.alert("Peringatan", "Lengkapi semua data!");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

      const formattedTime = `${time.getHours().toString().padStart(2, "0")}:${time
        .getMinutes()
        .toString()
        .padStart(2, "0")}:00`;

      await api.put(
        `/tasks/${id}`,
        {
          title,
          description,
          date: formattedDate,
          time: formattedTime,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert("Berhasil", "Tugas berhasil diperbarui");
      router.push("/");
    } catch (error) {
      console.error("❌ Gagal update tugas:", error);
      Alert.alert("Error", "Gagal memperbarui tugas!");
    }
  };

  // Delete task handler
  const handleDelete = async () => {
    Alert.alert(
      "Konfirmasi Hapus",
      "Apakah Anda yakin ingin menghapus tugas ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              await api.delete(`/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              Alert.alert("Berhasil", "Tugas berhasil dihapus");
              router.push("/tasks");
            } catch (error) {
              console.error("❌ Gagal hapus tugas:", error);
              Alert.alert("Error", "Gagal menghapus tugas!");
            }
          },
        },
      ]
    );
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDate(Platform.OS === "ios");
    if (selectedDate) setDate(selectedDate);
  };

  const onChangeTime = (event: any, selectedTime?: Date) => {
    setShowTime(Platform.OS === "ios");
    if (selectedTime) setTime(selectedTime);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient 
        colors={["#8e2de2", "#ff0080"]} 
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>Edit Tugas</Text>

          {/* Input Judul */}
          <TextInput
            placeholder="Judul Tugas"
            placeholderTextColor="#8e2de2"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          {/* Input Deskripsi */}
          <TextInput
            placeholder="Deskripsi"
            placeholderTextColor="#8e2de2"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            style={[styles.input, styles.textArea]}
          />

          {/* Tombol Tanggal */}
          <TouchableOpacity
            onPress={() => setShowDate(true)}
            style={styles.dateButton}
          >
            <Text style={styles.buttonText}>
              Tanggal: {date.toLocaleDateString("id-ID")}
            </Text>
          </TouchableOpacity>

          {/* Date Picker */}
          {showDate && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}

          {/* Tombol Waktu */}
          <TouchableOpacity
            onPress={() => setShowTime(true)}
            style={styles.dateButton}
          >
            <Text style={styles.buttonText}>
              Waktu: {time.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>

          {/* Time Picker */}
          {showTime && (
            <DateTimePicker
              value={time}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onChangeTime}
            />
          )}

          {/* Tombol Simpan */}
          <TouchableOpacity onPress={handleUpdate} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
          </TouchableOpacity>

          {/* Tombol Hapus */}
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Hapus Tugas</Text>
          </TouchableOpacity>
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
    color: "#FFFFFF",
  },
  input: {
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    color: "#8e2de2",
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
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#FC0FC0",
    borderRadius: 15,
    padding: 18,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 18,
  },
  deleteButton: {
    backgroundColor: "#d32f2f",
    borderRadius: 15,
    padding: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 18,
  },
});
