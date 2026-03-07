import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { useCart } from '../context/CartContext';

export default function CartScreen() {
  const { cart, increase, decrease, remove, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckout = async () => {
    try {
      for (const item of cart) {
        await fetch(`http://localhost:5000/api/products/${item.id}`, {
          method: 'PUT', // หรือ PUT แล้วแต่ backend
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            stock: item.stock - item.qty,
          }),
        });
      }

      clearCart();

      router.push('/payment-success');
    } catch (err) {
      console.log(err);
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image
        source={{ uri: 'https://placekitten.com/200/200' }}
        style={styles.image}
      />

      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>

        <Text style={styles.price}>{item.price} บาท</Text>

        <Text style={styles.stock}>เหลือ {item.stock} ชิ้น</Text>

        <View style={styles.qtyRow}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => decrease(item.id)}
            disabled={item.qty === 1}
          >
            <Text style={styles.qtyText}>-</Text>
          </TouchableOpacity>

          <Text style={styles.qty}>{item.qty}</Text>

          <TouchableOpacity
            style={[styles.qtyBtn, item.qty >= item.stock && styles.disabled]}
            onPress={() => increase(item.id)}
            disabled={item.qty >= item.stock}
          >
            <Text style={styles.qtyText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => remove(item.id)}>
          <Text style={styles.remove}>ลบสินค้า</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 My Cart</Text>

      {cart.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyIcon}>🛍️</Text>
          <Text style={styles.emptyText}>ยังไม่มีสินค้าในตะกร้า</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 120 }}
          />

          <View style={styles.totalBox}>
            <View>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.total}>{total} บาท</Text>
            </View>

            <TouchableOpacity style={styles.payBtn} onPress={handleCheckout}>
              <Text style={styles.payText}>ชำระเงิน</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    padding: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    elevation: 2,
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },

  info: {
    flex: 1,
    marginLeft: 10,
  },

  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  price: {
    color: '#ff7a00',
    fontWeight: 'bold',
    marginTop: 2,
  },

  stock: {
    color: 'gray',
    fontSize: 12,
    marginTop: 3,
  },

  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },

  qtyText: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  qty: {
    marginHorizontal: 10,
    fontSize: 16,
  },

  disabled: {
    opacity: 0.3,
  },

  remove: {
    color: 'red',
    marginTop: 5,
    fontSize: 13,
  },

  totalBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  totalLabel: {
    color: 'gray',
  },

  total: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  payBtn: {
    backgroundColor: '#ff7a00',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 10,
  },

  payText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyIcon: {
    fontSize: 50,
  },

  emptyText: {
    marginTop: 10,
    color: 'gray',
    fontSize: 18,
  },
});
