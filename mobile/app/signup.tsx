import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'seller'>('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleSignup = async () => {
    setLoading(true);
    setError('');

    try {
      const body: any = { email, password };

      if (role === 'seller') {
        body.role = 'seller';
      }

      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data);
      } else {
        login(email, data.user.role);
        router.back();
      }
    } catch (err) {
      setError('Network error');
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>

        {/* Role selector */}
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              role === 'customer' && styles.roleActive,
            ]}
            onPress={() => setRole('customer')}
          >
            <Text
              style={[
                styles.roleText,
                role === 'customer' && styles.roleTextActive,
              ]}
            >
              👤 Customer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleButton, role === 'seller' && styles.roleActive]}
            onPress={() => setRole('seller')}
          >
            <Text
              style={[
                styles.roleText,
                role === 'seller' && styles.roleTextActive,
              ]}
            >
              🏪 Seller
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fabf87',
  },

  card: {
    width: '85%',
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    elevation: 5,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },

  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  roleButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },

  roleActive: {
    backgroundColor: '#333',
    borderColor: '#333',
  },

  roleText: {
    fontWeight: '600',
  },

  roleTextActive: {
    color: 'white',
  },

  input: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },

  button: {
    backgroundColor: '#333',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  error: {
    color: 'red',
    marginBottom: 10,
  },
});
