import React, { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../services/api";

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
    router.push("/");  // Arahkan ke Home setelah simpan
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

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
        Edit Tugas
      </Text>

      <TextInput
        label="Judul"
        value={title}
        onChangeText={setTitle}
        style={{ marginBottom: 10 }}
      />

      <TextInput
        label="Deskripsi"
        value={description}
        onChangeText={setDescription}
        multiline
        style={{ marginBottom: 10 }}
      />

      <Button
        mode="outlined"
        onPress={() => setShowDate(true)}
        style={{ marginBottom: 10 }}
      >
        {`Tanggal: ${date.toLocaleDateString("id-ID")}`}
      </Button>

      {showDate && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDate(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Button
        mode="outlined"
        onPress={() => setShowTime(true)}
        style={{ marginBottom: 10 }}
      >
        {`Waktu: ${time.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })}`}
      </Button>

      {showTime && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selectedTime) => {
            setShowTime(false);
            if (selectedTime) setTime(selectedTime);
          }}
        />
      )}

      <Button mode="contained" onPress={handleUpdate} style={{ marginBottom: 10 }}>
        Simpan Perubahan
      </Button>

      <Button
        mode="outlined"
        onPress={handleDelete}
        buttonColor="#d32f2f"
        textColor="#fff"
      >
        Hapus Tugas
      </Button>
    </View>
  );
}
