import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { TextInput, Button, Text } from 'react-native-paper';
import api from '../services/api';
import { LoginStyles } from '@/constants/styles/LoginSty';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Pacifico: require('../../assets/fonts/Pacifico-Regular.ttf'),
  });

  if (!fontsLoaded) return null;

  // ALIDASI SAMA SEPERTI LOGIN
  const validateEmail = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    setEmail(cleaned);
    
    if (!cleaned.endsWith('@gmail.com') && !cleaned.endsWith('@example.com')) {
      setEmailError('Email harus @gmail.com atau @example.com');
    } else {
      setEmailError('');
    }
  };

  const handleRegister = async () => {
    if (emailError || !email || password.length < 5) {
      alert('Email @gmail.com & password min 5 chars');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/register', { email: email.trim(), password });
      if (res.data.success) {
        alert('Akun dibuat! Silahkan login');
        router.replace('/login');
      } else {
        alert('Register gagal: ' + res.data.message);
      }
    } catch {
      alert('Gagal register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#6a11cb', '#ff3366']}
      style={LoginStyles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={LoginStyles.titleContainer}>
        <Text style={LoginStyles.titleText}>Taskify Register</Text>
        <Image 
          source={require('@/assets/images/xsa.png')} 
          style={LoginStyles.titleLogo} 
        />
      </View>

      {/* EMAIL INPUT SAMA */}
      {/* USERNAME */}
            <View style={LoginStyles.labelContainer}>
              <Text style={LoginStyles.labelText}>Username</Text>
              <TextInput
                value={email}
                onChangeText={validateEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={LoginStyles.input}
                placeholder="contoh : exsa@gmail.com"
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
                placeholder="Min 5 karakter"
              />
            </View>

      {/* tombol sama seperti login  */}
      <Button 
        mode="contained" 
        onPress={handleRegister} 
        loading={loading}
        style={LoginStyles.button}
        labelStyle={{ fontSize: 18 }}
      >
        Daftar
      </Button>

      <Button 
        onPress={() => router.push('/login')}
        style={LoginStyles.secondaryButton}
        labelStyle={{ color: 'white' }}
      >
        Sudah punya akun? Login
      </Button>
    </LinearGradient>
  );
}
