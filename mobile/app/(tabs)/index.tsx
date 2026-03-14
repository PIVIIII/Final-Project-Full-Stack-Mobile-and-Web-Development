import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Link } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [power, setPower] = useState(0);

  const [catImage, setCatImage] = useState<string | null>(null);
  const [catFact, setCatFact] = useState<string | null>(null);

  const [imageError, setImageError] = useState(false);
  const [factError, setFactError] = useState(false);
  const [offline, setOffline] = useState(false);

  const handlePress = () => {
    const randomPower = Math.floor(Math.random() * 10) + 5;
    setPower((prev) => prev + randomPower);
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

  const fetchData = async () => {
    try {
      const results = await Promise.allSettled([
        axios.get('https://api.thecatapi.com/v1/images/search'),
        axios.get('https://catfact.ninja/fact'),
      ]);

      // ---------- CAT IMAGE ----------
      if (results[0].status === 'fulfilled') {
        const img = results[0].value.data[0].url;

        setCatImage(img);
        setImageError(false);

        await AsyncStorage.setItem('catImage', img);
      } else {
        setImageError(true);
      }

      // ---------- CAT FACT ----------
      if (results[1].status === 'fulfilled') {
        const fact = results[1].value.data.fact;

        setCatFact(fact);
        setFactError(false);

        await AsyncStorage.setItem('catFact', fact);
      } else {
        setFactError(true);
      }

      setOffline(false);
    } catch (error) {
      // ---------- OFFLINE MODE ----------
      const savedImage = await AsyncStorage.getItem('catImage');
      const savedFact = await AsyncStorage.getItem('catFact');

      if (savedImage) setCatImage(savedImage);
      if (savedFact) setCatFact(savedFact);

      setOffline(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.centerBox}>
        <TouchableOpacity onPress={handlePress}>
          <Text
            style={[styles.title, { color: getColor(), fontSize: getSize() }]}
          >
            MeowMarket
          </Text>
        </TouchableOpacity>

        <Text style={styles.subtitle}>ตลาดของเล่นสำหรับเจ้าเหมียว 🐱</Text>

        {offline && <Text style={styles.offline}>offline data</Text>}

        {/* CAT IMAGE */}
        {imageError ? (
          <Text style={styles.error}>Image API Error</Text>
        ) : catImage ? (
          <Image source={{ uri: catImage }} style={styles.image} />
        ) : null}

        {/* CAT FACT */}
        {factError ? (
          <Text style={styles.error}>Fact API Error</Text>
        ) : (
          <Text style={styles.fact}>{catFact}</Text>
        )}

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
    backgroundColor: '#f7be75',
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

  image: {
    width: 200,
    height: 200,
    marginTop: 15,
    borderRadius: 10,
  },

  fact: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
  },

  error: {
    color: 'red',
    marginTop: 10,
  },

  offline: {
    marginTop: 10,
    color: 'orange',
    fontWeight: 'bold',
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
});
