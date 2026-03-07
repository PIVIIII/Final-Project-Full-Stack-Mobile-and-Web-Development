import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';

const products = [
  {
    id: '1',
    name: 'Cat Feather Toy',
    price: 120,
    image: 'https://cdn-icons-png.flaticon.com/512/616/616408.png',
  },
  {
    id: '2',
    name: 'Cat Ball Toy',
    price: 80,
    image: 'https://cdn-icons-png.flaticon.com/512/616/616430.png',
  },
  {
    id: '3',
    name: 'Cat Tunnel',
    price: 350,
    image: 'https://cdn-icons-png.flaticon.com/512/616/616408.png',
  },
  {
    id: '4',
    name: 'Cat Scratcher',
    price: 220,
    image: 'https://cdn-icons-png.flaticon.com/512/616/616430.png',
  },
];

export default function ProductsScreen() {
  const [search, setSearch] = useState('');

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: '/product/[id]',
          params: { id: item.id },
        })
      }
    >
      <Image source={{ uri: item.image }} style={styles.image} />

      <Text style={styles.name}>{item.name}</Text>

      <Text style={styles.price}>{item.price} บาท</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐱 สินค้าสำหรับแมว</Text>

      {/* SEARCH */}
      <TextInput
        placeholder="ค้นหาสินค้า..."
        style={styles.search}
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  search: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },

  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    width: '48%',
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
  },

  image: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },

  name: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  price: {
    marginTop: 5,
    fontSize: 14,
    color: '#ff8c42',
    fontWeight: 'bold',
  },
});
