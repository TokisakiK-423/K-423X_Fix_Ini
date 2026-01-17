import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, Alert, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Home, Clock } from 'lucide-react-native';
import * as NavigationBar from 'expo-navigation-bar';
import api from '../services/api';
import { HomeStyles } from '@/constants/styles/HomeSty';

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    NavigationBar.setButtonStyleAsync('dark');
    loadData();
  }, []);

  const loadData = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) return router.replace('/login');

    await getUser();
    await getAllTasks();
    setLoading(false);
  };

  const getUser = async () => {
    const userStr = await AsyncStorage.getItem('user');
    if (userStr) setUser(JSON.parse(userStr));
  };

  const getAllTasks = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await api.get('/tasks', { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) {
        setAllTasks(res.data.tasks
          .map((t: any) => ({ ...t, status: t.status === true || t.status === 'true' }))
          .filter((task: any) => !task.status));
      }
    } catch {
      Alert.alert('Error', 'Gagal ambil tugas');
    }
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['token', 'user']);
    router.replace('/login');
  };

  const completeTask = async (taskId: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await api.patch(`/tasks/${taskId}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) getAllTasks();
    } catch {
      Alert.alert('Error', 'Gagal selesaikan tugas');
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === 'header') {
      return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Avatar email={user?.email || "User"} />
          <Text style={HomeStyles.title}>{item.title}</Text>
        </View>
      );
    }
    if (item.type === 'buttons') return (
      <View style={HomeStyles.buttonContainer}>
        <Button mode="contained" onPress={logout}
          style={HomeStyles.logoutButton}
          labelStyle={HomeStyles.logoutButtonLabel}
        >+ Tugas</Button>
        <Button mode="contained" onPress={() => router.push('/tasks/add')}
          style={HomeStyles.button}>Logout</Button>
      </View>
    );
    if (item.type === 'subtitle') return <Text style={HomeStyles.subtitle}>{item.title}</Text>;
    if (item.type === 'empty') return <Text style={HomeStyles.emptyText}>{item.title}</Text>;

    // Task card
    const formatDate = (dateString: string) => {
      try {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
      } catch {
        return 'Tidak valid';
      }
    };

    return (
      <Card style={HomeStyles.taskCard} onPress={() => router.push(`/tasks/edit?id=${item.id}`)}>
        <Card.Content style={HomeStyles.cardContent}>
          <View style={HomeStyles.taskInfo}>
            <Text style={HomeStyles.taskTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text style={HomeStyles.taskDateTime}>
              {formatDate(item.date)} {item.time?.slice(0, 5) || 'Tidak ada waktu'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => completeTask(item.id)}>
            <Check color="#34C759" size={24} />
          </TouchableOpacity>
        </Card.Content>
      </Card>
    );
  };

  const combinedData = [
    { type: 'header', title: `Halo, ${user?.email || 'User'}` },
    { type: 'buttons' },
    { type: 'subtitle', title: 'Daftar Semua Tugas' },
    ...(allTasks.length > 0 ? allTasks.map(t => ({ ...t, type: 'task' })) : [{ type: 'empty', title: 'Belum ada tugas' }])
  ];

  return (
    <SafeAreaView style={HomeStyles.safeArea}>
      <LinearGradient colors={['#8e2de2', '#ff0080']} style={HomeStyles.gradientContainer}>
        <FlatList
          data={combinedData}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={HomeStyles.container}
          renderItem={renderItem}
          refreshing={loading}
          onRefresh={getAllTasks}
        />
        <View style={HomeStyles.bottomButtons}>
          <Button icon={() => <Home color="#fff" size={20} />} mode="contained" style={HomeStyles.navButton} onPress={() => router.replace('/')}>
            Beranda
          </Button>
          <Button icon={() => <Clock color="#fff" size={20} />} mode="contained" style={HomeStyles.navButton} onPress={() => router.push('/riwayat')}>
            Riwayat
          </Button>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
