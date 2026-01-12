import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Platform } from "react-native";
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

      const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD
      const formattedTime = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

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
      router.push("/");  // Arahkan ke Home setelah simpan
    } catch (error: any) {
      console.error("Axios error:", error);
      Alert.alert("Error", error.response?.data?.message || "Gagal menambahkan tugas!");
    }
  };

  // fungsi pilih tanggal
  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) setDate(selectedDate);
  };

  // fungsi pilih waktu
  const onChangeTime = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selectedTime) setTime(selectedTime);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient 
        colors={["#8e2de2", "#ff0080"]} 
        style={{ flex: 1 }}
      >
    <View style={{ flex: 1, padding: 20, paddingBottom: 100 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 20 }}>
        Tambah Tugas
      </Text>

      <TextInput
        placeholder="Judul Tugas"
        value={title}
        onChangeText={setTitle}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          padding: 10,
          marginBottom: 10,
        }}
      />

      <TextInput
        placeholder="Deskripsi"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          padding: 10,
          marginBottom: 10,
          textAlignVertical: "top",
        }}
      />

      {/* Tombol pilih tanggal */}
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={{
          borderWidth: 1,
          borderColor: "#aaa",
          borderRadius: 20,
          padding: 12,
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Text style={{ color: "#5e3ba2" }}>
          {date ? date.toLocaleDateString() : "Pilih Tanggal"}
        </Text>
      </TouchableOpacity>

      {/* Tombol pilih waktu */}
      <TouchableOpacity
        onPress={() => setShowTimePicker(true)}
        style={{
          borderWidth: 1,
          borderColor: "#aaa",
          borderRadius: 20,
          padding: 12,
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Text style={{ color: "#5e3ba2" }}>
          {time ? time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Pilih Waktu"}
        </Text>
      </TouchableOpacity>

      {/* Tombol simpan */}
      <TouchableOpacity
        onPress={handleSave}
        style={{
          backgroundColor: "#5e3ba2",
          borderRadius: 10,
          padding: 15,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Simpan</Text>
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
      {showTimePicker && (
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
