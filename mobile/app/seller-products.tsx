import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';

interface Product {
  _id: string;
  name: string;
  originalPrice: number;
  images: string[];
}

export default function MyProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');

      const res = await fetch('http://localhost:5000/api/products/my', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setProducts(data);
    } catch (err) {
      console.log(err);

      Toast.show({
        type: 'error',
        text1: 'Load failed',
        text2: 'ไม่สามารถโหลดสินค้าได้',
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const previousItems = [...products];

    // C4 Optimistic notification
    Toast.show({
      type: 'info',
      text1: 'Deleting product',
      text2: 'ลบสินค้าแล้ว (กำลังซิงค์...)',
      position: 'top',
    });

    // C1 Optimistic UI
    setProducts((prev) => prev.filter((p) => p._id !== id));

    const token = localStorage.getItem('token');
    const MAX_RETRY = 3;

    for (let attempt = 1; attempt <= MAX_RETRY; attempt++) {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Delete failed');
        }

        console.log('DELETE OK');

        Toast.show({
          type: 'success',
          text1: 'Deleted',
          text2: 'ลบสินค้าเรียบร้อย',
          position: 'top',
        });

        return;
      } catch (err) {
        console.log(`Retrying... (${attempt})`);

        if (attempt === MAX_RETRY) {
          console.log('DELETE FAILED');

          // C3 Rollback
          setProducts(previousItems);

          Toast.show({
            type: 'error',
            text1: 'Delete Failed',
            text2: 'ไม่สามารถลบสินค้าได้ ระบบคืนค่าเดิมให้แล้ว',
            position: 'top',
          });
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.images[0] }} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>฿{item.originalPrice}</Text>
      </View>

      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => handleDelete(item._id)}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No products</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    fontSize: 16,
    fontWeight: '600',
  },

  price: {
    color: 'green',
    marginTop: 4,
  },

  deleteBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#ff4d4d',
    borderRadius: 6,
  },

  deleteText: {
    color: 'white',
    fontWeight: '500',
  },
});
