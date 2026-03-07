import { View, Text, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const products = [
  {
    id: '1',
    name: 'Cat Feather Toy',
    price: 120,
    image: 'https://cdn-icons-png.flaticon.com/512/616/616408.png',
    description: 'ของเล่นขนนกสำหรับแมว เพิ่มความสนุกในการล่า',
  },
  {
    id: '2',
    name: 'Cat Ball Toy',
    price: 80,
    image: 'https://cdn-icons-png.flaticon.com/512/616/616430.png',
    description: 'ลูกบอลของเล่นให้แมววิ่งไล่',
  },
  {
    id: '3',
    name: 'Cat Tunnel',
    price: 350,
    image: 'https://cdn-icons-png.flaticon.com/512/616/616408.png',
    description: 'อุโมงค์สำหรับแมวซ่อนและเล่น',
  },
  {
    id: '4',
    name: 'Cat Scratcher',
    price: 220,
    image: 'https://cdn-icons-png.flaticon.com/512/616/616430.png',
    description: 'ที่ลับเล็บสำหรับแมว',
  },
];

export default function ProductDetail() {
  const { id } = useLocalSearchParams();

  const product = products.find((p) => p.id === id);

  if (!product) return <Text>Product not found</Text>;

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />

      <Text style={styles.name}>{product.name}</Text>

      <Text style={styles.price}>{product.price} บาท</Text>

      <Text style={styles.desc}>{product.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'white',
  },

  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },

  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  price: {
    fontSize: 20,
    color: '#ff8c42',
    marginVertical: 10,
  },

  desc: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
});
