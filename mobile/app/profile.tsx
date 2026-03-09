import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState<any>(null);
  const [borderColor, setBorderColor] = useState('#ff7f50');

  const randomColor = () => {
    const colors = [
      '#ff6b6b',
      '#6bc5ff',
      '#ffd93d',
      '#6bff95',
      '#c56bff',
      '#ff9f43',
    ];

    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    console.log('USER:', user);

    if (!user) return;

    fetch(`http://localhost:5000/api/users/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log('PROFILE:', data);
        setProfile(data);
      })
      .catch(() => {
        console.log('error loading profile');
      });
  }, [user]);
  const handlePress = (text: string) => {
    const newColor = randomColor();
    setBorderColor(newColor);
    Alert.alert(text);
  };

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{
            uri:
              profile.avatar ||
              'https://cdn2.thecatapi.com/images/MTY3ODIyMQ.jpg',
          }}
          style={[styles.profileImage, { borderColor }]}
        />

        <Text style={styles.username}>{profile.username || user?.email}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handlePress(profile.link ? profile.link : '-')}
        >
          <Text style={styles.buttonText}>
            🔗 Link: {profile.link ? profile.link : '-'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handlePress(profile.phone ? profile.phone : '-')}
        >
          <Text style={styles.buttonText}>
            📞 Phone: {profile.phone ? profile.phone : '-'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handlePress(profile.address ? profile.address : '-')}
        >
          <Text style={styles.buttonText}>
            📍 Address: {profile.address ? profile.address : '-'}
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
    backgroundColor: '#f2f4f8',
  },

  card: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    width: 320,

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },

  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 5,
    marginBottom: 20,
  },

  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  button: {
    width: '100%',
    backgroundColor: '#4c8bf5',
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
