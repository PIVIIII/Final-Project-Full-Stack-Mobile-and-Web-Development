import { Stack, Link } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useState, useRef } from 'react';

import { AuthProvider, useAuth } from '../context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

function Header() {
  const { userId, email, role, logout } = useAuth();
  const { theme, toggleTheme } = useTheme(); // ⭐ ต้องมี

  const isDark = theme === 'dark';

  const [open, setOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    if (open) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setOpen(false));
    } else {
      setOpen(true);
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setOpen(false));
  };

  const slide = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 0],
  });

  return (
    <View
      style={[
        styles.headerWrapper,
        { backgroundColor: isDark ? '#111' : '#222' },
      ]}
    >
      {/* HEADER BAR */}

      <View style={styles.headerBar}>
        <View style={styles.leftSection}>
          <TouchableOpacity onPress={toggleMenu}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            MeowMarket {role === 'seller' ? '(seller)' : ''}
          </Text>
        </View>

        {/* THEME BUTTON */}
        <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 15 }}>
          <Text style={{ fontSize: 20 }}>{theme === 'dark' ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>

        <View style={styles.rightSection}>
          {userId ? (
            <>
              <Text style={styles.headerAuth}>{email}</Text>

              <TouchableOpacity onPress={logout}>
                <Text style={styles.menuText}>LOGOUT</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Link href="/login" asChild>
                <TouchableOpacity>
                  <Text style={styles.menuText}>LOGIN</Text>
                </TouchableOpacity>
              </Link>

              <Link href="/signup" asChild>
                <TouchableOpacity>
                  <Text style={styles.menuText}>SIGN UP</Text>
                </TouchableOpacity>
              </Link>
            </>
          )}
        </View>
      </View>

      {/* DROPDOWN */}

      {open && (
        <Animated.View
          style={[
            styles.dropdown,
            {
              backgroundColor: isDark ? '#222' : '#333',
              opacity: slideAnim,
              transform: [{ translateY: slide }],
            },
          ]}
        >
          <Link href="/profile" asChild>
            <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
              <Text style={styles.menuText}>PROFILE</Text>
            </TouchableOpacity>
          </Link>

          {role === 'seller' && (
            <>
              <Link href="/add-product" asChild>
                <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
                  <Text style={styles.menuText}>ADD PRODUCT</Text>
                </TouchableOpacity>
              </Link>

              <Link href="/seller-orders" asChild>
                <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
                  <Text style={styles.menuText}>SELLER ORDERS</Text>
                </TouchableOpacity>
              </Link>

              <Link href="/seller-reviews" asChild>
                <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
                  <Text style={styles.menuText}>REPLIES</Text>
                </TouchableOpacity>
              </Link>
            </>
          )}

          <Link href="/products" asChild>
            <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
              <Text style={styles.menuText}>PRODUCT</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/cart" asChild>
            <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
              <Text style={styles.menuText}>CART</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/orders" asChild>
            <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
              <Text style={styles.menuText}>MY ORDERS</Text>
            </TouchableOpacity>
          </Link>
        </Animated.View>
      )}
    </View>
  );
}

function Layout() {
  return (
    <>
      <Header />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Layout />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#222',
  },

  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  menuIcon: {
    fontSize: 26,
    color: 'white',
  },

  headerTitle: {
    color: '#ff8c42',
    fontWeight: 'bold',
    fontSize: 20,
  },

  headerAuth: {
    color: 'white',
    fontSize: 14,
  },

  dropdown: {
    paddingVertical: 10,
  },

  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },

  menuText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
});
