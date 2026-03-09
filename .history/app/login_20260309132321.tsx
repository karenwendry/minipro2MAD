import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function LoginScreen() {

  const [loginType, setLoginType] = useState<'mahasiswa' | 'admin'>('mahasiswa');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!identifier || !password) {
      Alert.alert('Error', 'Harap isi semua kolom!');
      return;
    }

    Alert.alert(
      'Login Berhasil',
      `Masuk sebagai: ${loginType.toUpperCase()}\nID/NIM: ${identifier}`
    );

    router.replace('/home');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >

      <View style={styles.cardContainer}>

        <View style={styles.header}>
          <Text style={styles.title}>Sistem Perpustakaan</Text>
          <Text style={styles.subtitle}>Silakan masuk ke akun Anda</Text>
        </View>

        <View style={styles.tabContainer}>

          <TouchableOpacity
            style={[styles.tabButton, loginType === 'mahasiswa' && styles.tabActive]}
            onPress={() => setLoginType('mahasiswa')}
          >
            <Text style={[styles.tabText, loginType === 'mahasiswa' && styles.tabTextActive]}>
              Mahasiswa
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, loginType === 'admin' && styles.tabActive]}
            onPress={() => setLoginType('admin')}
          >
            <Text style={[styles.tabText, loginType === 'admin' && styles.tabTextActive]}>
              Admin
            </Text>
          </TouchableOpacity>

        </View>

        <View style={styles.formContainer}>

          <Text style={styles.label}>
            {loginType === 'mahasiswa' ? 'NIM / Akun Kampus' : 'ID Admin / Username'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder={loginType === 'mahasiswa' ? 'Masukkan NIM' : 'Masukkan ID Admin'}
            placeholderTextColor="#5990c0"
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Kata Sandi</Text>

          <TextInput
            style={styles.input}
            placeholder="Masukkan kata sandi"
            placeholderTextColor="#5990c0"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Masuk ke Sistem</Text>
          </TouchableOpacity>

        </View>

        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>🔒 Autentikasi Aman & Terenkripsi</Text>
        </View>

      </View>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fcedd3',
    justifyContent: 'center',
    padding: 20
  },

  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    elevation: 5
  },

  header: {
    alignItems: 'center',
    marginBottom: 24
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#102a6b'
  },

  subtitle: {
    fontSize: 14,
    color: '#015185'
  },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#5990c0',
    borderRadius: 8,
    marginBottom: 24
  },

  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center'
  },

  tabActive: {
    backgroundColor: '#102a6b'
  },

  tabText: {
    color: '#ffffff',
    fontWeight: '600'
  },

  tabTextActive: {
    color: '#fcedd3'
  },

  formContainer: {
    marginBottom: 10
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#102a6b',
    marginBottom: 8
  },

  input: {
    borderWidth: 1.5,
    borderColor: '#5990c0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20
  },

  loginButton: {
    backgroundColor: '#102a6b',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center'
  },

  loginButtonText: {
    color: '#fcedd3',
    fontSize: 16,
    fontWeight: 'bold'
  },

  footerInfo: {
    marginTop: 20,
    alignItems: 'center'
  },

  footerText: {
    fontSize: 12,
    color: '#015185'
  }

});