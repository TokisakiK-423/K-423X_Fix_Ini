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
        <Text style={LoginStyles.titleText}>Taskify</Text>
        <Image source={require('@/assets/images/xsa.png')} style={LoginStyles.titleLogo} />
      </View>
      {/* Email input + validasi */}
      <TextInput
        label="Email"
        value={email}
        onChangeText={validateEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={LoginStyles.input}
        error={!!emailError}                   
      />
      {emailError ? <Text style={LoginStyles.errorText}>{emailError}</Text> : null}
      {/* Password input */}
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={LoginStyles.input}
      />
      {/* Tombol Login + Register */}
      <Button mode="contained" onPress={handleLogin} loading={loading} style={LoginStyles.button}>
        Login
      </Button>
      <Button onPress={() => router.push('/register')} style={LoginStyles.secondaryButton}>
        Belum punya akun? Daftar
      </Button>
    </LinearGradient>
  );
}
