import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
} from 'react-native';
import { Link, Stack, router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';

type Product = {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  tags?: string[];
};

export default function ProductsScreen() {
  const { email } = useLocalSearchParams();

  const API_URL = 'http://localhost:5000/api/products';

  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = ['food', 'toy', 'electronic'];

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const filteredProducts = products.filter((p: Product) => {
    const nameMatch = p.name?.toLowerCase().includes(search.toLowerCase());

    const tagMatch =
      selectedTags.length === 0 ||
      (Array.isArray(p.tags) &&
        p.tags.some((tag) => selectedTags.includes(tag)));

    return nameMatch && tagMatch;
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
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* CONTENT */}
      <View style={styles.container}>
        <Text style={styles.title}>🐱 สินค้าสำหรับแมว</Text>

        <TextInput
          placeholder="Search"
          style={styles.search}
          value={search}
          onChangeText={setSearch}
        />

        {/* TAG FILTER */}
        <View style={styles.tagFilter}>
          {allTags.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={[
                styles.filterTag,
                selectedTags.includes(tag) && styles.activeTag,
              ]}
              onPress={() => toggleTag(tag)}
            >
              <Text
                style={[
                  styles.filterTagText,
                  selectedTags.includes(tag) && styles.activeTagText,
                ]}
              >
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filteredProducts}
          keyExtractor={(item, index) =>
            item._id || item.id || index.toString()
          }
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#222',
  },

  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 20,
  },

  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#222',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },

  headerTitle: {
    color: '#ff8c42',
    fontWeight: 'bold',
    fontSize: 22,
  },

  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },

  cartIcon: {
    width: 28,
    height: 28,
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  headerAuth: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  headerUser: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
    marginBottom: 10,
  },

  tagFilter: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },

  filterTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#ddd',
  },

  activeTag: {
    backgroundColor: '#ff8c42',
  },

  filterTagText: {
    color: '#333',
  },

  activeTagText: {
    color: 'white',
    fontWeight: 'bold',
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

  name: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

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
  },

  price: {
    marginTop: 5,
    fontSize: 14,
    color: '#ff8c42',
    fontWeight: 'bold',
  },
});
