import { View, Text, StyleSheet } from 'react-native';

type Props = {
  label: string;
  value: string | number;
};

export default function CurrencyCard({ label, value }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.2)', // Glassmorphism
    padding: 16,
    borderRadius: 16,
    marginVertical: 8,

    elevation: 6, // Android shadow

    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },

  label: {
    fontSize: 14,
    color: '#555',
  },

  value: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
