import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, Clock } from 'lucide-react-native';
import api from '../services/api';
import { HomeStyles } from '@/constants/styles/HomeSty';  

const Avatar = ({ email }: { email: string }) => {

export default function RiwayatPage() {
  const [user, setUser] = useState<any>(null);
  const [completedTasks, setCompletedTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) return router.replace('/login');
    
    await getUser();
    await getCompletedTasks();
    setLoading(false);
  };

  const getUser = async () => {
    const userStr = await AsyncStorage.getItem('user');
    if (userStr) setUser(JSON.parse(userStr));
  };

  const getCompletedTasks = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await api.get('/tasks', { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) {
        setCompletedTasks(res.data.tasks
          .map((t: any) => ({ ...t, status: t.status === true || t.status === 'true' }))
          .filter((t: any) => t.status));  
      }
    } catch {
      alert('Gagal ambil riwayat');
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
    if (item.type === 'subtitle') {
      return (
        <Text
          style={[
            HomeStyles.subtitle,
            { textAlign: 'center', marginTop: 50, marginBottom: 1 },
          ]}
        >
          {item.title}
        </Text>
      );
    }
     if (item.type === 'empty') {
      return (
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center',
          marginTop: 200
        }}>
          <Text style={HomeStyles.emptyText}>{item.title}</Text>
        </View>
      );
    }

    // Task card (SAMA PERSIS HomePage)
    const formatDate = (dateString: string) => {
      try {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
      } catch {
        return 'Tidak valid';
      }
    };

    return (
      <Card style={HomeStyles.taskCard}>
        <Card.Content style={HomeStyles.cardContent}>
          <View style={HomeStyles.taskInfo}>
            <Text style={HomeStyles.completedTaskTitle}>{item.title}</Text>
            <Text style={HomeStyles.completedTaskTitle}>{item.description}</Text>
            <Text style={HomeStyles.taskDateTime}>
              {formatDate(item.date)} {item.time?.slice(0, 5) || 'Tidak ada waktu'}
            </Text>
          </View>
          <Trash2
            color="#ff3b30"
            size={22}
            onPress={() => deleteTask(item.id)}
          />
        </Card.Content>
      </Card>
    );
  };

  const combinedData = [
    { type: 'header', title: `Halo, ${user?.email || 'User'}` },
    { type: 'subtitle', title: 'Riwayat Tugas Selesai' },
    ...(completedTasks.length > 0 ? completedTasks.map(t => ({ ...t, type: 'task' })) : [{ type: 'empty', title: 'Belum ada tugas selesai' }])
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
          onRefresh={getCompletedTasks}
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
