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

  /* ---------------- SEARCH ---------------- */

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
        {item.images && item.images.length > 0 && (
          <Image source={{ uri: item.images[0] }} style={styles.productImage} />
        )}

        <View style={styles.cardContent}>
          <View style={styles.cardTop}>
            <Text style={styles.name} numberOfLines={2}>
              {item.name}
            </Text>{' '}
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

        <TouchableOpacity style={styles.retryBtn} onPress={fetchProducts}>
          <Text style={{ color: 'white' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* ---------------- MAIN UI ---------------- */

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
        {' '}
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
        {filteredProducts.length === 0 ? (
          <Text style={styles.noResult}>
            No products found for "{searchInput}"
          </Text>
        ) : (
          <FlatList
            data={filteredProducts}
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

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#111',
  },

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f6f6f6',
  },

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
    width: CARD_WIDTH as any,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 18,
    overflow: 'hidden',
    elevation: 3,
    flexGrow: 1,
    marginHorizontal: 6,
  },

  productImage: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'cover',
  },

  cardContent: {
    padding: 10,
  },

  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  name: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },

  fav: {
    fontSize: 16,
  },

  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },

  tag: {
    backgroundColor: '#eee',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 10,
    marginRight: 4,
    marginBottom: 4,
  },

  price: {
    marginTop: 6,
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
