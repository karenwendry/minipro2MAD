import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/Colors';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleSelectRole = (role: 'student' | 'admin') => {
    router.push({ pathname: '/login', params: { role } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="library" size={80} color={COLORS.sandyAmber} />
        </View>
        
        <Text style={styles.title}>EduLibrary</Text>
        <Text style={styles.subtitle}>Jelajahi dunia pengetahuan dalam satu genggaman. Silakan masuk untuk memulai.</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.studentButton]} 
            onPress={() => handleSelectRole('student')}
            activeOpacity={0.8}
          >
            <Ionicons name="school" size={20} color={COLORS.silentNavy} style={styles.btnIcon} />
            <Text style={styles.studentButtonText}>Masuk sebagai Mahasiswa</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.adminButton]} 
            onPress={() => handleSelectRole('admin')}
            activeOpacity={0.8}
          >
            <Ionicons name="settings" size={20} color={COLORS.white} style={styles.btnIcon} />
            <Text style={styles.adminButtonText}>Masuk sebagai Admin</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.silentNavy,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: COLORS.sandyAmber,
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.lightCream,
    textAlign: 'center',
    marginBottom: 50,
    lineHeight: 24,
    opacity: 0.9,
  },
  buttonContainer: {
    gap: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  btnIcon: {
    marginRight: 10,
  },
  studentButton: {
    backgroundColor: COLORS.sandyAmber,
  },
  studentButtonText: {
    color: COLORS.silentNavy,
    fontSize: 16,
    fontWeight: 'bold',
  },
  adminButton: {
    backgroundColor: COLORS.blueCurrent,
    borderWidth: 1,
    borderColor: COLORS.lightBlue,
  },
  adminButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});