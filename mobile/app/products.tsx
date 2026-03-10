import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { useFavoriteStore } from '../store/useFavoriteStore';

type Product = {
  _id: string;
  name: string;
  originalPrice: number;
  tags?: string[];
};

export default function ProductsScreen() {
  const API_URL = 'http://localhost:5000/api/products';

  const favorites = useFavoriteStore((state) => state.favorites);

  const [searchInput, setSearchInput] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const allTags = ['food', 'toy', 'litter', 'accessory', 'health'];

  /* ---------------- FETCH PRODUCTS ---------------- */

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      const res = await fetch(API_URL);

      if (!res.ok) throw new Error('fetch error');

      const data = await res.json();

      setProducts(data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* ---------------- DEBOUNCED SEARCH ---------------- */

  const debouncedSearch = useCallback(
    async (query: string) => {
      if (!query) {
        fetchProducts();
        return;
      }

      try {
        setLoading(true);

        const res = await fetch(`${API_URL}/search?q=${query}`);

        const data = await res.json();

        setProducts(data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    },
    [fetchProducts],
  );

  useEffect(() => {
    const delay = setTimeout(() => {
      debouncedSearch(searchInput);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchInput, debouncedSearch]);

  /* ---------------- TAG FILTER ---------------- */

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  /* ---------------- FILTER PRODUCTS ---------------- */

  const filteredProducts = products.filter((p) => {
    const tagMatch =
      selectedTags.length === 0 ||
      (Array.isArray(p.tags) &&
        p.tags.some((tag) => selectedTags.includes(tag)));

    return tagMatch;
  });

  /* ---------------- PRODUCT CARD ---------------- */

  const renderItem = ({ item }: { item: Product }) => {
    const isFav = favorites.includes(item._id);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: '/product/[id]',
            params: { id: item._id },
          })
        }
      >
        <View style={styles.cardTop}>
          <Text style={styles.name}>{item.name}</Text>
          {isFav && <Text style={styles.fav}>❤️</Text>}
        </View>

        {item.tags && (
          <View style={styles.tagsContainer}>
            {item.tags.map((tag) => (
              <Text key={tag} style={styles.tag}>
                {tag}
              </Text>
            ))}
          </View>
        )}

        <Text style={styles.price}>฿{item.originalPrice}</Text>
      </TouchableOpacity>
    );
  };

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff8c42" />
        <Text>Loading products...</Text>
      </View>
    );
  }

  /* ---------------- ERROR ---------------- */

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>⚠️ Error loading products</Text>

        <TouchableOpacity style={styles.retryBtn} onPress={fetchProducts}>
          <Text style={{ color: 'white' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* ---------------- MAIN UI ---------------- */

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <Text style={styles.title}>🐱 Cat Products</Text>

        {/* SEARCH */}

        <TextInput
          placeholder="Search products..."
          style={styles.search}
          value={searchInput}
          onChangeText={setSearchInput}
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

        {/* EMPTY */}

        {filteredProducts.length === 0 ? (
          <Text style={styles.noResult}>
            No products found for "{searchInput}"
          </Text>
        ) : (
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#111' },

  container: { flex: 1, padding: 20, backgroundColor: '#f6f6f6' },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  search: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
  },

  tagFilter: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },

  filterTag: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#ddd',
  },

  activeTag: { backgroundColor: '#ff8c42' },

  filterTagText: { color: '#333' },

  activeTagText: { color: 'white', fontWeight: 'bold' },

  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    width: '48%',
    marginBottom: 16,
    elevation: 3,
  },

  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  name: { fontSize: 15, fontWeight: 'bold', flex: 1 },

  fav: { fontSize: 18 },

  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 6,
  },

  tag: {
    backgroundColor: '#eee',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 11,
  },

  price: {
    marginTop: 10,
    fontWeight: 'bold',
    color: '#ff8c42',
    fontSize: 16,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  error: {
    color: 'red',
    fontSize: 18,
    marginBottom: 10,
  },

  retryBtn: {
    backgroundColor: '#ff8c42',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },

  noResult: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 18,
    color: 'gray',
  },
});
