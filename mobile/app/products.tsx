import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { useFavoriteStore } from '../store/useFavoriteStore';
import { useTheme } from '../context/ThemeContext';

const screenWidth = Dimensions.get('window').width;
const numColumns = screenWidth < 600 ? 1 : 2;
const CARD_WIDTH = screenWidth < 600 ? '100%' : screenWidth * 0.44;

type Product = {
  _id: string;
  name: string;
  originalPrice: number;
  tags?: string[];
  images?: string[];
};

export default function ProductsScreen() {
  const API_URL = 'http://localhost:5000/api/products';

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const favorites = useFavoriteStore((state) => state.favorites);

  const [searchInput, setSearchInput] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const allTags = [
    'dryfood',
    'wetfood',
    'snack',
    'catnip',
    'toy',
    'scratcher',
    'litter',
    'carrier',
    'bed',
    'grooming',
  ];

  /* ---------------- FETCH PRODUCTS ---------------- */

  const fetchProducts = useCallback(async (query = '', tags: string[] = []) => {
    try {
      setLoading(true);
      setError(false);

      let url = `${API_URL}`;

      if (query || tags.length > 0) {
        const params: string[] = [];

        if (query) params.push(`q=${query}`);
        if (tags.length > 0) params.push(`tags=${tags.join(',')}`);

        url = `${API_URL}/search?${params.join('&')}`;
      }

      const res = await fetch(url, { cache: 'no-store' });
      const data = await res.json();

      setProducts(query || tags.length ? data.data : data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ---------------- READ URL (DEEP LINKING) ---------------- */

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    const q = query.get('q') || '';
    const tags = query.get('tags');

    const tagArray = tags ? tags.split(',') : [];

    setSearchInput(q);
    setSelectedTags(tagArray);

    fetchProducts(q, tagArray);
  }, []);

  /* ---------------- SEARCH ---------------- */

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProducts(searchInput, selectedTags);

      router.setParams({
        q: searchInput || undefined,
        tags: selectedTags.length ? selectedTags.join(',') : undefined,
      });
    }, 400);

    return () => clearTimeout(delay);
  }, [searchInput]);

  /* ---------------- TAG TOGGLE ---------------- */

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const newTags = prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag];

      fetchProducts(searchInput, newTags);

      router.setParams({
        q: searchInput || undefined,
        tags: newTags.length ? newTags.join(',') : undefined,
      });

      return newTags;
    });
  };

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
        {item.images && item.images.length > 0 && (
          <Image source={{ uri: item.images[0] }} style={styles.productImage} />
        )}

        <View style={styles.cardContent}>
          <View style={styles.cardTop}>
            <Text style={styles.name} numberOfLines={2}>
              {item.name}
            </Text>

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
        </View>
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

        <TouchableOpacity
          style={styles.retryBtn}
          onPress={() => fetchProducts()}
        >
          <Text style={{ color: 'white' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: isDark ? '#656565' : '#f6f6f6' },
      ]}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? '#656565' : '#f6f6f6' },
        ]}
      >
        <Text style={styles.title}>🐱 Cat Products</Text>

        <TextInput
          placeholder="Search products..."
          style={styles.search}
          value={searchInput}
          onChangeText={setSearchInput}
        />

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
        {products.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.noResult}>
              ไม่พบสินค้าตาม
              {searchInput ? ` ชื่อ "${searchInput}"` : ''}
              {searchInput && selectedTags.length > 0 ? ' และ' : ''}
              {selectedTags.length > 0
                ? ` แท็ก "${selectedTags.join(', ')}"`
                : ''}
            </Text>
          </View>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            numColumns={numColumns}
            columnWrapperStyle={
              numColumns > 1 ? { justifyContent: 'space-between' } : undefined
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 20 },

  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 15 },

  search: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
  },

  tagFilter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
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
    width: CARD_WIDTH as any,
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 18,
    overflow: 'hidden',
    elevation: 3,
    marginHorizontal: 6,
  },
  noResult: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginTop: 40,
  },

  productImage: { width: '100%', aspectRatio: 1 },

  cardContent: { padding: 10 },

  cardTop: { flexDirection: 'row', justifyContent: 'space-between' },

  name: { fontSize: 14, fontWeight: 'bold', flex: 1 },

  fav: { fontSize: 16 },

  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },

  tag: {
    backgroundColor: '#eee',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 10,
    marginRight: 4,
    marginBottom: 4,
  },

  price: { marginTop: 6, fontWeight: 'bold', color: '#ff8c42', fontSize: 16 },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  error: { color: 'red', fontSize: 18, marginBottom: 10 },

  retryBtn: {
    backgroundColor: '#ff8c42',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
});
