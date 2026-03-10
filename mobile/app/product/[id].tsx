import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
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
  images: string[];
};

export default function ProductDetail() {
  const { id } = useLocalSearchParams();

  const addToCart = useCartStore((state) => state.addToCart);
  const { favorites, toggleFavorite } = useFavoriteStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  const API_URL = `http://localhost:5000/api/products/${id}`;

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setSelectedImage(0);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text>Product not found</Text>
      </View>
    );
  }

  const salePrice =
    product.originalPrice * ((100 - product.discountPercent) / 100);

  const isFav = favorites.includes(product._id);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>

      {/* IMAGE SECTION */}
      <View style={styles.imageRow}>
        {product.images?.map((img, i) => (
          <Image key={i} source={{ uri: img }} style={styles.productImage} />
        ))}
      </View>
      {/* PRODUCT CARD */}
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.name}>{product.name}</Text>

          <TouchableOpacity onPress={() => toggleFavorite(product._id)}>
            <Text style={styles.fav}>{isFav ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.desc}>{product.description}</Text>

        <Text style={styles.price}>฿ {salePrice.toFixed(2)}</Text>

        <Text style={styles.stock}>Stock: {product.stock}</Text>

        {/* qty */}
        <View style={styles.qtyRow}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setQty(Math.max(1, qty - 1))}
          >
            <Text style={styles.qtyText}>-</Text>
          </TouchableOpacity>

          <Text style={styles.qty}>{qty}</Text>

          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setQty(Math.min(product.stock, qty + 1))}
          >
            <Text style={styles.qtyText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.cartBtn}
          onPress={() =>
            addToCart(
              {
                id: product._id,
                name: product.name,
                price: salePrice,
                stock: product.stock,
              },
              qty,
            )
          }
        >
          <Text style={styles.cartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  back: {
    margin: 20,
    color: '#ff8c42',
    fontWeight: 'bold',
  },

  imageSection: {
    alignItems: 'center',
  },

  hero: {
    width: '95%',
    height: 350,
    borderRadius: 12,
  },

  thumbRow: {
    marginTop: 10,
    paddingHorizontal: 10,
  },

  thumb: {
    width: 70,
    height: 70,
    marginRight: 10,
    borderRadius: 8,
  },

  thumbActive: {
    borderWidth: 2,
    borderColor: '#ff8c42',
  },

  card: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  fav: {
    fontSize: 26,
  },

  desc: {
    marginTop: 10,
    color: '#555',
  },

  price: {
    marginTop: 15,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ff8c42',
  },

  stock: {
    marginTop: 10,
    color: 'gray',
  },

  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },

  qtyBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },

  qtyText: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  qty: {
    marginHorizontal: 20,
    fontSize: 18,
  },

  cartBtn: {
    marginTop: 25,
    backgroundColor: '#ff8c42',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  cartText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  imageRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },

  productImage: {
    width: 160,
    height: 160,
    borderRadius: 12,
    resizeMode: 'cover',
  },
});
