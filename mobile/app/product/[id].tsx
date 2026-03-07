import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';

type Product = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
};

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState(false);

  const API_URL = `http://localhost:5000/api/products/${id}`;

  useEffect(() => {
    if (!id) return;

    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.log(err));
  }, [id]);

  const increase = () => {
    if (!product) return;

    if (qty < product.stock) {
      setQty((prev) => prev + 1);
    }
  };

  const decrease = () => {
    if (qty > 1) {
      setQty((prev) => prev - 1);
    }
  };

  const handleAdd = () => {
    if (!product) return;

    addToCart(
      {
        id: product._id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        qty: 0,
      },
      qty,
    );

    setToast(true);

    setTimeout(() => {
      setToast(false);
    }, 2000);
  };

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{product.name}</Text>

      {product.description && (
        <Text style={styles.description}>{product.description}</Text>
      )}

      <Text style={styles.price}>{product.price} บาท</Text>

      <Text style={styles.stock}>คงเหลือ {product.stock} ชิ้น</Text>

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
        <Text style={styles.orderText}>เพิ่มลงตะกร้า</Text>
      </TouchableOpacity>

      {toast && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>เพิ่มลงรถเข็นสำเร็จ</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },

  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  description: {
    fontSize: 16,
    marginBottom: 20,
    color: '#444',
  },

  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff8c42',
    marginBottom: 5,
  },

  stock: {
    color: 'gray',
    marginBottom: 20,
  },

  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 20,
  },

  qtyBtn: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  qty: {
    fontSize: 18,
  },

  disabled: {
    opacity: 0.3,
  },

  orderBtn: {
    backgroundColor: '#ff8c42',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  orderText: {
    color: 'white',
    fontWeight: 'bold',
  },

  toast: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },

  toastText: {
    color: 'white',
  },
});
