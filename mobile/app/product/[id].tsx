import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useCartStore } from '../../store/useCartStore';
import { useFavoriteStore } from '../../store/useFavoriteStore';

type Product = {
  _id: string;
  name: string;
  description?: string;
  originalPrice: number;
  discountPercent: number;
  stock: number;
};

export default function ProductDetail() {
  const { id } = useLocalSearchParams();

  const addToCart = useCartStore((state) => state.addToCart);
  const { favorites, toggleFavorite } = useFavoriteStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(false);

  const API_URL = `http://localhost:5000/api/products/${id}`;

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error('not-found');
        }
        return res.json();
      })
      .then((data) => setProduct(data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  // ✅ C4 NotFound Handling
  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 20 }}>Product not found</Text>
      </View>
    );
  }

  const salePrice =
    product.originalPrice * ((100 - product.discountPercent) / 100);

  const isFav = favorites.includes(product._id);

  const increase = () => {
    if (qty < product.stock) setQty((prev) => prev + 1);
  };

  const decrease = () => {
    if (qty > 1) setQty((prev) => prev - 1);
  };

  const handleAdd = () => {
    addToCart(
      {
        id: product._id,
        name: product.name,
        price: salePrice,
        stock: product.stock,
      },
      qty,
    );

    setToast(true);

    setTimeout(() => {
      setToast(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {/* ✅ C3 Back Button */}
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.name}>{product.name}</Text>

        <TouchableOpacity onPress={() => toggleFavorite(product._id)}>
          <Text style={styles.fav}>{isFav ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      {product.description && (
        <Text style={styles.description}>{product.description}</Text>
      )}

      <Text style={styles.price}>฿ {salePrice.toFixed(2)}</Text>

      {product.discountPercent > 0 && (
        <Text style={styles.original}>
          ฿ {product.originalPrice} (-{product.discountPercent}%)
        </Text>
      )}

      <Text style={styles.stock}>Stock: {product.stock}</Text>

      <View style={styles.qtyRow}>
        <TouchableOpacity onPress={decrease} disabled={qty === 1}>
          <Text style={[styles.qtyBtn, qty === 1 && styles.disabled]}>-</Text>
        </TouchableOpacity>

        <Text style={styles.qty}>{qty}</Text>

        <TouchableOpacity onPress={increase} disabled={qty >= product.stock}>
          <Text
            style={[styles.qtyBtn, qty >= product.stock && styles.disabled]}
          >
            +
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.orderBtn} onPress={handleAdd}>
        <Text style={styles.orderText}>Add to Cart</Text>
      </TouchableOpacity>

      {toast && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>Added to cart</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  back: { fontSize: 16, marginBottom: 10, color: '#ff8c42' },

  backBtn: {
    marginTop: 20,
    backgroundColor: '#ff8c42',
    padding: 10,
    borderRadius: 10,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  name: { fontSize: 26, fontWeight: 'bold' },

  fav: { fontSize: 28 },

  description: { marginTop: 10, fontSize: 16, color: '#444' },

  price: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ff8c42',
  },

  original: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },

  stock: { marginTop: 10, color: 'gray' },

  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginTop: 30,
  },

  qtyBtn: { fontSize: 30, fontWeight: 'bold' },

  qty: { fontSize: 18 },

  disabled: { opacity: 0.3 },

  orderBtn: {
    marginTop: 30,
    backgroundColor: '#ff8c42',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  orderText: { color: 'white', fontWeight: 'bold' },

  toast: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },

  toastText: { color: 'white' },
});
