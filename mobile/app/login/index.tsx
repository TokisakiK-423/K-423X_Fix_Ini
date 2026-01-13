"use client";
import React, { useState } from 'react';
import { Image, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { TextInput, Button, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { LoginStyles } from '@/constants/styles/LoginSty';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ambil font Pacifico
  const [fontsLoaded] = useFonts({
    Pacifico: require('../../assets/fonts/Pacifico-Regular.ttf'),
  });
  if (!fontsLoaded) return null;

  // Validasi email real-time (hapus spasi + cek domain)
  const validateEmail = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    setEmail(cleaned);

    if (!cleaned.endsWith('@gmail.com') && !cleaned.endsWith('@example.com')) {
      setEmailError('Email harus @gmail.com atau @example.com');
      setEmailError('');
    }
  };

  // login + simpan token
  const handleLogin = async () => {
    if (emailError || !email || password.length < 5) {
      alert('Email @gmail.com & password min 5 chars');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email: email.trim(), password });
      if (res.data.success) {
        await AsyncStorage.setItem('token', res.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
        router.replace('/home');
      } else {
        alert('Login gagal: ' + res.data.message);
      }
    } catch {
      alert('Gagal login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#6a11cb', '#ff3366']} style={LoginStyles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={LoginStyles.titleContainer}>
        <Text style={LoginStyles.titleText}>Taskify Login</Text>
        <Image source={require('@/assets/images/xsa.png')} style={LoginStyles.titleLogo} />
      </View>
      {/* Email input + validasi */}
      {/* USERNAME */}
      <View style={LoginStyles.labelContainer}>
        <Text style={LoginStyles.labelText}>Username</Text>
        <TextInput
          value={email}
          onChangeText={validateEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={LoginStyles.input}
          placeholder="gunakan email yang terdaftar"
          error={!!emailError}
        />
      </View>
      {emailError ? <Text style={LoginStyles.errorText}>{emailError}</Text> : null}

      {/* PASSWORD */}
      <View style={LoginStyles.labelContainer}>
        <Text style={LoginStyles.labelText}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={LoginStyles.input}
          placeholder="Gunakan sandi yang terdaftar"
        />
      </View>
      {/* Tombol Login + Register */}
      <Button mode="contained" onPress={handleLogin} loading={loading}
        style={LoginStyles.button} labelStyle={{ fontSize: 18 }}>
        Login
      </Button>
      <Button onPress={() => router.push('/register')}
        style={LoginStyles.secondaryButton} labelStyle={{ color: 'white' }}>
        Belum punya akun? Daftar
      </Button>
    </LinearGradient>
  );
}
