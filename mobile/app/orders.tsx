import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Orders() {
  const { userId } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/orders/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
      });
  }, [userId]);

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.product_id?.name || 'Product'}</Text>

      <Text>Quantity: {item.quantity}</Text>

      <Text>Total: ฿{item.totalPrice}</Text>

      <Text style={styles.date}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>
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
    backgroundColor: '#f5f5f5',
  },

  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  date: {
    color: 'gray',
    marginTop: 5,
  },
});
