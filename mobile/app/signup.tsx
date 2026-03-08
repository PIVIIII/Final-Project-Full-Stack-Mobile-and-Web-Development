import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSignupStore } from '../store/useSignupStore';

export default function Signup() {
  const { updateFormData } = useSignupStore();

  const signupBuyer = () => {
    updateFormData({ role: 'buyer' });
    router.push('/apply/step1');
  };

  const signupSeller = () => {
    updateFormData({ role: 'seller' });
    router.push('/apply/step1');
  };

  return (
    <LinearGradient colors={['#f8c390', '#f6e3b4']} style={styles.bg}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>

        <Text style={styles.subtitle}>สมัครสมาชิกเพื่อเริ่มใช้งาน Catmart</Text>

        <TouchableOpacity
          style={[styles.optionCard, styles.buyer]}
          onPress={signupBuyer}
        >
          <Text style={styles.icon}>🐱</Text>

          <View>
            <Text style={styles.optionTitle}>สมัครบัญชีผู้ใช้</Text>
            <Text style={styles.optionDesc}>สำหรับผู้ที่ต้องการซื้อสินค้า</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionCard, styles.seller]}
          onPress={signupSeller}
        >
          <Text style={styles.icon}>🏪</Text>

          <View>
            <Text style={styles.optionTitle}>สมัครบัญชีร้านค้า</Text>
            <Text style={styles.optionDesc}>สำหรับผู้ขายสินค้าใน Catmart</Text>
          </View>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },

  subtitle: {
    textAlign: 'center',
    color: '#777',
    marginBottom: 30,
    fontSize: 15,
  },

  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 14,
    marginBottom: 16,
  },

  buyer: {
    backgroundColor: '#fff4ec',
  },

  seller: {
    backgroundColor: '#e8f5e9',
  },

  icon: {
    fontSize: 30,
    marginRight: 16,
  },

  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  optionDesc: {
    fontSize: 13,
    color: '#777',
    marginTop: 3,
  },
});
