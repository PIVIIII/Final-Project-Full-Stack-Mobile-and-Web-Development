import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function PaymentSuccess() {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>✅</Text>

      <Text style={styles.title}>ชำระเงินสำเร็จ</Text>

      <Text style={styles.subtitle}>ร้านค้ากำลังเตรียมจัดส่งสินค้า</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace('/')}
      >
        <Text style={styles.buttonText}>กลับหน้าหลัก</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },

  icon: {
    fontSize: 70,
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },

  subtitle: {
    marginTop: 10,
    color: 'gray',
    fontSize: 16,
  },

  button: {
    marginTop: 30,
    backgroundColor: '#ff7a00',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
