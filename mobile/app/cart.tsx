import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { useCartStore } from '../store/useCartStore';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function CartScreen() {
  const { userId } = useAuth();

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const cart = useCartStore((state) => state.cart);
  const increase = useCartStore((state) => state.increase);
  const decrease = useCartStore((state) => state.decrease);
  const remove = useCartStore((state) => state.remove);
  const clearCart = useCartStore((state) => state.clearCart);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const slideAnim = useState(new Animated.Value(0))[0];

  const toggleDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: drawerOpen ? 0 : 260,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setDrawerOpen(!drawerOpen);
  };

  // Calculation
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const vatRate = 0.07;
  const vat = Math.round(subtotal * vatRate);
  const shipping = subtotal > 0 ? 100 : 0;
  const total = subtotal + vat + shipping;

  // Checkout
  const handleCheckout = async () => {
    if (!userId) {
      router.push('/login');
      return;
    }

    try {
      for (const item of cart) {
        const res = await fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            product_id: item._id,
            quantity: item.qty,
          }),
        });

        const data = await res.json();
        console.log('order response', data);

        if (!res.ok) {
          alert(JSON.stringify(data));
          return;
        }
      }

      clearCart();
      router.push('/payment-success');
    } catch (err) {
      console.log(err);
      alert('Checkout failed');
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

        <Text style={styles.price}>฿{item.price}</Text>

        <Text style={styles.stock}>เหลือ {item.stock} ชิ้น</Text>

        <View style={styles.qtyRow}>
          <TouchableOpacity
            style={[styles.qtyBtn, item.qty === 1 && styles.disabled]}
            onPress={() => decrease(item._id)}
          >
            <Text style={styles.qtyText}>-</Text>
          </TouchableOpacity>

          <Text style={styles.qty}>{item.qty}</Text>

          <TouchableOpacity
            style={[styles.qtyBtn, item.qty >= item.stock && styles.disabled]}
            onPress={() => increase(item._id)}
          >
            <Text style={styles.qtyText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => remove(item._id)}>
          <Text style={styles.remove}>ลบสินค้า</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? '#656565' : '#f6f6f6' },
      ]}
    >
      {' '}
      <Text style={styles.title}>🛒 My Cart</Text>
      {cart.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>ยังไม่มีสินค้าในตะกร้า</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 200 }}
          />

          <View style={styles.summaryBox}>
            <TouchableOpacity
              style={styles.summaryHeader}
              onPress={toggleDrawer}
            >
              <Text style={styles.summaryTitle}>Summary</Text>
              <Text style={styles.arrow}>{drawerOpen ? 'v' : '^'}</Text>
            </TouchableOpacity>

            <Animated.View
              style={[
                styles.summaryDetail,
                {
                  maxHeight: slideAnim,
                  overflow: 'hidden',
                },
              ]}
            >
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>฿{subtotal}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>VAT (7%)</Text>
                <Text style={styles.summaryValue}>฿{vat}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.summaryValue}>฿{shipping}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total</Text>
                <Text style={styles.summaryTotal}>฿{total}</Text>
              </View>

              <TouchableOpacity style={styles.payBtn} onPress={handleCheckout}>
                <Text style={styles.payText}>ชำระเงิน</Text>
              </TouchableOpacity>
            </Animated.View>
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
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 14,
    marginBottom: 15,
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  price: {
    color: '#ff7a00',
    fontWeight: 'bold',
  },

  stock: {
    color: 'gray',
    marginBottom: 5,
  },

  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  qtyBtn: {
    width: 35,
    height: 35,
    borderRadius: 8,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },

  qtyText: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  qty: {
    marginHorizontal: 10,
    fontSize: 18,
  },

  disabled: {
    opacity: 0.3,
  },

  remove: {
    color: 'red',
    marginTop: 5,
  },

  summaryBox: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
  },

  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  arrow: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ff7a00',
  },

  summaryDetail: {
    marginTop: 15,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  summaryLabel: {
    color: 'gray',
    fontSize: 16,
  },

  summaryValue: {
    fontWeight: 'bold',
  },

  summaryTotal: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#ff7a00',
  },

  payBtn: {
    backgroundColor: '#ff7a00',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
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

  emptyText: {
    fontSize: 18,
    color: 'gray',
  },
});
