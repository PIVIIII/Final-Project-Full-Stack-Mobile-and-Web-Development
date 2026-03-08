import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSignupStore } from '../../store/useSignupStore';
import StepIndicator from '../../components/StepIndicator';

export default function Review() {
  const { formData, resetForm } = useSignupStore();
  const isSeller = formData.role === 'seller';

  const submit = async () => {
    await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    resetForm();

    router.replace('/login');
  };

  return (
    <View style={styles.bg}>
      <View style={[styles.card, isSeller && styles.cardSeller]}>
        <StepIndicator step={3} />

        <Text style={styles.title}>Review</Text>

        <View style={styles.info}>
          <Text>Email: {formData.email}</Text>
          <Text>Username: {formData.username}</Text>
          <Text>Phone: {formData.phone}</Text>
          <Text>Link: {formData.link || '-'}</Text>
          <Text>Address: {formData.address}</Text>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.back} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, isSeller && styles.buttonSeller]}
            onPress={submit}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },

  card: {
    width: '80%',
    minHeight: 530,
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    justifyContent: 'space-between',
  },

  cardSeller: {
    borderTopWidth: 6,
    borderTopColor: '#4CAF50',
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  info: {
    gap: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  button: {
    backgroundColor: '#ff7f50',
    padding: 12,
    borderRadius: 10,
  },

  buttonSeller: {
    backgroundColor: '#4CAF50',
  },

  back: {
    backgroundColor: '#999',
    padding: 12,
    borderRadius: 10,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
