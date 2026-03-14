import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { router } from 'expo-router';
import { API_URL } from '../constants/api';

/* ---------------- TYPES ---------------- */

type Note = {
  id: number;
  text: string;
  status: 'pending' | 'synced';
};

type Stats = {
  totalProducts: number;
  maxSalePrice: number;
  avgSalePrice: number;
};

/* ---------------- COMPONENT ---------------- */

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [isOnline, setIsOnline] = useState(true);

  const [notes, setNotes] = useState<Note[]>([]);
  const [noteInput, setNoteInput] = useState('');

  const API = API_URL;

  /* ---------------- FETCH STATS ---------------- */

  useEffect(() => {
    const checkRole = async () => {
      const role = await AsyncStorage.getItem('role');

      if (role !== 'admin') {
        router.replace('/'); // redirect ออก
      }
    };

    checkRole();
  }, []);

  const fetchStats = async () => {
    const token = await AsyncStorage.getItem('token');

    try {
      const res = await fetch(`${API}/api/products/stats`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* ---------------- LOAD NOTES ---------------- */

  const loadNotes = async () => {
    try {
      const stored = await AsyncStorage.getItem('admin_notes');

      if (stored) {
        const parsed: Note[] = JSON.parse(stored);
        setNotes(parsed);
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* ---------------- ADD NOTE ---------------- */

  const addNote = async () => {
    if (!noteInput.trim()) return;

    const newNote: Note = {
      id: Date.now(),
      text: noteInput,
      status: 'pending',
    };

    const updated = [...notes, newNote];

    setNotes(updated);
    setNoteInput('');

    await AsyncStorage.setItem('admin_notes', JSON.stringify(updated));

    // ⭐ sync ทันทีถ้า online
    if (isOnline) {
      await syncNotes();
    }
  }; /* ---------------- SYNC QUEUE ---------------- */

  const syncNotes = async () => {
    try {
      const stored = await AsyncStorage.getItem('admin_notes');

      if (!stored) return;

      const parsed: Note[] = JSON.parse(stored);

      const pending = parsed.filter((n) => n.status === 'pending');

      if (pending.length === 0) return;

      for (const note of pending) {
        try {
          await fetch(`${API}/api/admin/notes`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(note),
          });

          note.status = 'synced'; // C4 duplicate prevention
        } catch (err) {
          console.log('sync error', err);
        }
      }

      await AsyncStorage.setItem('admin_notes', JSON.stringify(parsed));
      setNotes(parsed);
    } catch (err) {
      console.log(err);
    }
  };

  /* ---------------- NETWORK LISTENER (C2) ---------------- */

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = state.isConnected ?? false;

      setIsOnline(online);

      if (online) {
        syncNotes(); // C3 Auto Sync
      }
    });

    return () => unsubscribe();
  }, []);

  /* ---------------- INIT ---------------- */

  useEffect(() => {
    fetchStats();
    loadNotes();
    syncNotes();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStats();
  }, []);

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {' '}
        {/* STATUS */}
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: isOnline ? '#2ecc71' : '#e74c3c' },
            ]}
          >
            <Text style={styles.statusText}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>
        <Text style={styles.title}>Admin Dashboard</Text>
        {/* STATS */}
        <View style={styles.cardContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Total Products</Text>
            <Text style={styles.statValue}>{stats?.totalProducts ?? 0}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Max Sale Price</Text>
            <Text style={styles.statValue}>
              ฿{stats?.maxSalePrice?.toFixed(2) ?? 0}
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Average Price</Text>
            <Text style={styles.statValue}>
              ฿{stats?.avgSalePrice?.toFixed(2) ?? 0}
            </Text>
          </View>
        </View>
        {/* NOTES */}
        <View style={styles.noteSection}>
          <Text style={styles.noteTitle}>Admin Notes</Text>

          <View style={styles.inputRow}>
            <TextInput
              placeholder="Write admin note..."
              value={noteInput}
              onChangeText={setNoteInput}
              style={styles.input}
            />

            <TouchableOpacity style={styles.addButton} onPress={addNote}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          {notes.map((note) => (
            <View key={note.id} style={styles.noteCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.noteText}>{note.text}</Text>
              </View>

              <View
                style={[
                  styles.statusMini,
                  {
                    backgroundColor:
                      note.status === 'pending' ? '#f39c12' : '#2ecc71',
                  },
                ]}
              >
                <Text style={styles.statusMiniText}>
                  {note.status === 'pending' ? 'Pending' : 'Synced'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fb',
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 20,
  },

  /* STATUS */

  statusContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },

  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    color: 'white',
    fontWeight: '600',
  },

  /* CARDS */

  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 18,
    marginBottom: 16,

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },

  statTitle: {
    fontSize: 13,
    color: '#888',
    marginBottom: 6,
  },

  statValue: {
    fontSize: 26,
    fontWeight: '700',
  },

  /* NOTES */

  noteSection: {
    marginTop: 20,
  },

  noteTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  input: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },

  addButton: {
    width: 44,
    height: 44,
    backgroundColor: '#ff6b6b',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },

  /* NOTE CARD */

  noteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 14,
    marginTop: 10,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  noteText: {
    fontSize: 16,
  },

  statusMini: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  statusMiniText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
  },
});
