import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { router } from 'expo-router';

export default function Orders() {
  const { userId } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/orders/user/${userId}`)
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, [userId]);

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.product_id?.name || 'Product'}</Text>

      <Text style={styles.text}>Quantity: {item.quantity}</Text>
      <Text style={styles.text}>Total: ฿{item.totalPrice}</Text>

      <Text style={styles.date}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>

      {/* BUTTON ROW */}
      <View style={styles.buttonRow}>
        {/* VIEW PRODUCT */}
        <TouchableOpacity
          style={styles.viewBtn}
          onPress={() => router.push(`/product/${item.product_id._id}`)}
        >
          <Text style={styles.viewText}>View Product</Text>
        </TouchableOpacity>

        {/* WRITE REVIEW */}
        <TouchableOpacity
          style={styles.reviewBtn}
          onPress={() =>
            router.push({
              pathname: '/review',
              params: {
                productId: item.product_id._id,
                name: item.product_id.name,
                image: item.product_id.images?.[0],
              },
            })
          }
        >
          <Text style={styles.reviewText}>Write Review</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Orders</Text>

      <FlatList
        data={orders}
        keyExtractor={(item: any) => item._id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f6f9',
  },

  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  card: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 14,
    marginBottom: 15,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  text: {
    color: '#555',
  },

  date: {
    color: '#999',
    marginTop: 5,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 10,
  },

  viewBtn: {
    backgroundColor: '#eee',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  viewText: {
    fontWeight: '600',
    color: '#333',
  },

  reviewBtn: {
    backgroundColor: '#ff8c42',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  reviewText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
