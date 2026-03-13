import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile() {
  const { userId } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  const getAvatar = () => {
    if (!profile) {
      return 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
    }

    if (profile.role === 'buyer')
      return 'https://cdn-icons-png.flaticon.com/512/616/616430.png';

    if (profile.role === 'seller')
      return 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png';

    if (profile.role === 'admin')
      return 'https://cdn-icons-png.flaticon.com/512/616/616490.png';

    return 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  };
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setProfile(null);
        setError('No token found');
        return;
      }
      try {
        const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          setProfile(null);
          setError('Unauthorized or user not found');
          return;
        }
        const data = await res.json();
        setProfile(data);
        setError('');
      } catch {
        setProfile(null);
        setError('Network error');
      }
    };

    fetchProfile();
  }, [userId]);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image source={{ uri: getAvatar() }} style={styles.avatar} />

        <View style={styles.headerInfo}>
          <Text style={styles.name}>{profile.username}</Text>
          <Text style={styles.email}>
            {profile.email} - {profile.role}
          </Text>
        </View>
      </View>

      {/* ADMIN DASHBOARD */}
      {/* {role === 'admin' && (
        <TouchableOpacity
          style={styles.adminBtn}
          onPress={() => router.push('/admin-dashboard')}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            Admin Dashboard
          </Text>
        </TouchableOpacity>
      )} */}
      {/* ACCOUNT */}
      <Text style={styles.section}>Account</Text>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Username</Text>
          <TextInput style={styles.input} value={profile.username} />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={profile.email} />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Phone</Text>
          <TextInput style={styles.input} value={profile.phone || '-'} />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Address</Text>
          <TextInput style={styles.input} value={profile.address || '-'} />
        </View>
      </View>

      <TouchableOpacity style={styles.saveBtn}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f6f9',
    flex: 1,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 25,
    alignItems: 'center',
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginRight: 25,
  },

  headerInfo: {
    flex: 1,
  },

  name: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  email: {
    color: '#666',
    marginTop: 5,
  },

  uploadBtn: {
    marginTop: 15,
    backgroundColor: '#4c8bf5',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },

  uploadText: {
    color: 'white',
    fontWeight: '600',
  },

  section: {
    fontSize: 22,
    fontWeight: 'bold',
    margin: 20,
  },

  form: {
    backgroundColor: 'white',
    padding: 20,
  },

  field: {
    marginBottom: 18,
  },

  label: {
    color: '#777',
    marginBottom: 5,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fafafa',
  },

  saveBtn: {
    backgroundColor: '#1e88e5',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  saveText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  adminBtn: {
    backgroundColor: '#e53935',
    padding: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',
  },
});
