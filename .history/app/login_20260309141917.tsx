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
  const [isSignup, setIsSignup] = useState(false);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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

  const handleSignup = () => {

    if (!identifier || !password || !confirmPassword) {
      Alert.alert('Error', 'Semua kolom harus diisi');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Password tidak cocok');
      return;
    }

    Alert.alert(
      'Registrasi Berhasil',
      'Akun berhasil dibuat. Silakan login.'
    );

    setIsSignup(false);
    setIdentifier('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >

      <View style={styles.cardContainer}>

        <View style={styles.header}>
          <Text style={styles.title}>Unklab Library</Text>
          <Text style={styles.subtitle}>
            {isSignup ? 'Buat akun baru' : 'Login to your account'}
          </Text>
        </View>

        {!isSignup && (
          <View style={styles.tabContainer}>

            <TouchableOpacity
              style={[styles.tabButton, loginType === 'mahasiswa' && styles.tabActive]}
              onPress={() => setLoginType('mahasiswa')}
            >
              <Text style={[styles.tabText, loginType === 'mahasiswa' && styles.tabTextActive]}>
                Student
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
        )}

        <View style={styles.formContainer}>

          <Text style={styles.label}>
            {loginType === 'mahasiswa' ? 'NIM / Akun Kampus' : 'ID Admin / Username'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Masukkan ID"
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

          {isSignup && (
            <>
              <Text style={styles.label}>Konfirmasi Kata Sandi</Text>

              <TextInput
                style={styles.input}
                placeholder="Ulangi kata sandi"
                placeholderTextColor="#5990c0"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </>
          )}

          <TouchableOpacity
            style={styles.loginButton}
            onPress={isSignup ? handleSignup : handleLogin}
          >
            <Text style={styles.loginButtonText}>
              {isSignup ? 'Daftar Akun' : 'Masuk ke Sistem'}
            </Text>
          </TouchableOpacity>

        </View>

        <TouchableOpacity
          onPress={() => setIsSignup(!isSignup)}
        >
          <Text style={styles.signupText}>
            {isSignup
              ? 'Sudah punya akun? Login'
              : 'Belum punya akun? Daftar'}
          </Text>
        </TouchableOpacity>

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

  signupText: {
    textAlign: 'center',
    color: '#015185',
    marginTop: 10,
    fontWeight: '600'
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