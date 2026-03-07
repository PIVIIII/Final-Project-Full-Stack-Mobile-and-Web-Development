import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';

type Product = {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  tags?: string[];
};

export default function ProductsScreen() {
  // ดึงข้อมูลจาก server
  const API_URL = 'http://localhost:5000/api/products';
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  // search ทั้ง name และ nametag
  const filteredProducts = products.filter((p: Product) => {
    const nameMatch = p.name?.toLowerCase().includes(search.toLowerCase());
    const tagMatch = Array.isArray(p.tags)
      ? p.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
      : false;
    return nameMatch || tagMatch;
  });

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: '/product/[id]',
          params: { id: item._id || item.id },
        })
      }
    >
      <Text style={styles.name}>{item.name}</Text>
      {/* nametag */}
      {Array.isArray(item.tags) && item.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {item.tags.map((tag: string) => (
            <Text key={tag} style={styles.tag}>
              {tag}
            </Text>
          ))}
        </View>
      )}
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
        keyExtractor={(item, index) => item._id || item.id || index.toString()}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tagsContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    gap: 5,
  },
  tag: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 12,
    color: '#333',
    marginRight: 5,
  },
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
