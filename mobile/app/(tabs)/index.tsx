import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  const [power, setPower] = useState(0);

  const handlePress = () => {
    const randomPower = Math.floor(Math.random() * 10) + 5;
    setPower((prev) => prev + randomPower);
  };

  const getRank = () => {
    if (power >= 100) return 'Gold';
    if (power >= 50) return 'Silver';
    return 'Bronze';
  };

  const getColor = () => {
    if (power >= 100) return '#FFD700';
    if (power >= 50) return '#C0C0C0';
    return '#cd7f32';
  };

  const getSize = () => {
    if (power >= 100) return 52;
    if (power >= 50) return 44;
    return 36;
  };

  return (
    <View style={styles.container}>
      {/* top right */}
      <View style={styles.auth}>
        <Link href="/login" asChild>
          <Text style={styles.authText}>Login</Text>
        </Link>

        <Link href="/signup" asChild>
          <Text style={styles.authText}>Sign Up</Text>
        </Link>
      </View>

      {/* center content */}
      <View style={styles.centerBox}>
        <TouchableOpacity onPress={handlePress}>
          <Text
            style={[styles.title, { color: getColor(), fontSize: getSize() }]}
          >
            MeowMarket
          </Text>
        </TouchableOpacity>

        <Text style={styles.subtitle}>ตลาดของเล่นสำหรับเจ้าเหมียว 🐱</Text>

        {/* explore button */}
        <Link href="/products" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>สำรวจสินค้า</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEFA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  centerBox: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },

  title: {
    fontWeight: 'bold',
  },

  subtitle: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },

  button: {
    marginTop: 25,
    backgroundColor: '#ff8c42',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  auth: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'row',
    gap: 15,
  },

  authText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});
