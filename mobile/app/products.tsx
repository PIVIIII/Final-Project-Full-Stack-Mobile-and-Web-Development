import {
  View,
  Text,
  StyleSheet,
  FlatList,
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

  // Filter
  const filteredProducts = products.filter((p: Product) => {
    // search เฉพาะชื่อสินค้า
    const nameMatch = p.name?.toLowerCase().includes(search.toLowerCase());

    // tag filter (OR logic)
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
    <View style={styles.container}>
      <Text style={styles.title}>🐱 สินค้าสำหรับแมว</Text>

      {/* SEARCH */}
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
        keyExtractor={(item, index) => item._id || item.id || index.toString()}
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
