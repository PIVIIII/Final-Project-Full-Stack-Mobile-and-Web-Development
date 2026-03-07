import { Stack, Link, router } from 'expo-router';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';

function Header() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.headerBar}>
      <Text style={styles.headerTitle}>MeowMarket</Text>

      <View style={styles.headerRight}>
        {user ? (
          <>
            <Text style={styles.headerAuth}>{user.email}</Text>

            <TouchableOpacity
              onPress={() => {
                logout();
              }}
            >
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
      <Layout />
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

  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },

  cartIcon: {
    width: 28,
    height: 28,
  },

  headerRight: {
    flexDirection: 'row',
    gap: 12,
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
});
