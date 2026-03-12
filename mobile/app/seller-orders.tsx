import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

type Order = {
  _id: string;
  quantity: number;
  totalPrice: number;
  createdAt: string;
  user_id: {
    username: string;
    email: string;
  };
  product_id: {
    name: string;
    images?: string[];
  };
};

export default function SellerOrders() {
  const { userId } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/orders/seller/${userId}`)
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: Order }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.product_id?.images?.[0] }}
        style={styles.image}
      />

      <View style={styles.info}>
        <Text style={styles.product}>{item.product_id?.name}</Text>

        <Text>Customer: {item.user_id?.username}</Text>

        <Text>Qty: {item.quantity}</Text>

        <Text>Total: ฿{item.totalPrice}</Text>

        <Text style={styles.date}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Orders</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
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

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
  },

  info: {
    flex: 1,
  },

  product: {
    fontWeight: 'bold',
    fontSize: 16,
  },

  date: {
    color: 'gray',
    marginTop: 4,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
