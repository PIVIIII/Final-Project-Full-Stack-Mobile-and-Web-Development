import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

type Product = {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  price?: number;
};

export default function ProductDetail() {
  const { id } = useLocalSearchParams(); // ดึง id จาก route
  const [product, setProduct] = useState<Product | null>(null);

  const API_URL = `http://localhost:5000/api/products/${id}`;

  useEffect(() => {
    if (!id) return;

    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, [id]);

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{product.name}</Text>

      <Text style={styles.description}>{product.description}</Text>

      {product.price && <Text style={styles.price}>{product.price} บาท</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },

  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  description: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 22,
  },

  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff8c42',
  },
});
