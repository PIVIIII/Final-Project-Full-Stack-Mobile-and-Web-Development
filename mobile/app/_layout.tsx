import { Stack, Link, router } from 'expo-router';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { CartProvider } from '@/context/CartContext';

function Header() {
  const { user, logout } = useAuth();
  console.log('user?.role', user?.role);

  return (
    <View style={styles.headerBar}>
      {/* LEFT */}
      <View style={styles.headerLeft}>
        <Text style={styles.headerTitle}>
          MeowMarket {user?.role === 'seller' ? '(seller)' : ''}
        </Text>{' '}
      </View>

      {/* CENTER */}
      <View style={styles.headerCenter}>
        <Link href="/products" asChild>
          <TouchableOpacity>
            <Text style={styles.menuText}>PRODUCT</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/cart" asChild>
          <TouchableOpacity>
            <Text style={styles.menuText}>CART</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/profile" asChild>
          <TouchableOpacity>
            <Text style={styles.menuText}>PROFILE</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* RIGHT */}
      <View style={styles.headerRight}>
        {user ? (
          <>
            <Text style={styles.headerAuth}>{user.email}</Text>

            <TouchableOpacity onPress={() => logout()}>
              <Text style={styles.headerAuth}>Logout</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Link href="/login" asChild>
              <TouchableOpacity style={styles.loginButton}>
                <Text style={styles.loginText}>Log in</Text>
              </TouchableOpacity>
            </Link>

            <Link href="/signup" asChild>
              <TouchableOpacity style={styles.signupButton}>
                <Text style={styles.signupText}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </>
        )}
      </View>
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
    <AuthProvider>
      <CartProvider>
        <Layout />
      </CartProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#222',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },

  headerTitle: {
    color: '#ff8c42',
    fontWeight: 'bold',
    fontSize: 22,
  },

  cartIcon: {
    width: 28,
    height: 28,
  },

  headerAuth: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signupButton: {
    backgroundColor: 'white',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    elevation: 2,
  },
  signupText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },

  loginButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  menuText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  headerLeft: {
    flex: 1,
  },

  headerCenter: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
  },

  headerRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
});
