import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useCart } from '../context/CartContext';

export default function CartScreen() {
  const { cart, increase, decrease, remove } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Cart</Text>

      {cart.length === 0 ? (
        <Text style={styles.empty}>ยังไม่มีสินค้าในตะกร้า</Text>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.name}>{item.name}</Text>

                <Text>{item.price} บาท</Text>

                <Text style={styles.stock}>เหลือ {item.stock} ชิ้น</Text>

                <View style={styles.qtyRow}>
                  <TouchableOpacity
                    onPress={() => decrease(item.id)}
                    disabled={item.qty === 1}
                  >
                    <Text
                      style={[styles.qtyBtn, item.qty === 1 && styles.disabled]}
                    >
                      -
                    </Text>
                  </TouchableOpacity>

                  <Text>{item.qty}</Text>

                  <TouchableOpacity
                    onPress={() => increase(item.id)}
                    disabled={item.qty >= item.stock}
                  >
                    <Text
                      style={[
                        styles.qtyBtn,
                        item.qty >= item.stock && styles.disabled,
                      ]}
                    >
                      +
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => remove(item.id)}>
                  <Text style={styles.remove}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          <View style={styles.totalBox}>
            <Text style={styles.totalText}>Total: {total} บาท</Text>

            <TouchableOpacity style={styles.payBtn}>
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
    padding: 20,
    backgroundColor: '#f2f2f2',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },

  stock: {
    color: 'gray',
    marginTop: 4,
  },

  qtyRow: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
    marginTop: 5,
  },

  qtyBtn: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  disabled: {
    opacity: 0.3,
  },

  remove: {
    color: 'red',
    marginTop: 5,
  },

  totalBox: {
    marginTop: 20,
  },

  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  payBtn: {
    backgroundColor: '#ff8c42',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },

  payText: {
    color: 'white',
    fontWeight: 'bold',
  },

  empty: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: 'gray',
  },
});
