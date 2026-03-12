// import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
// import { useEffect, useState } from 'react';
// import { router } from 'expo-router';
// import { useAuth } from '../context/AuthContext';

// export default function AdminDashboard() {
//   const { userId, role } = useAuth();
//   const [stats, setStats] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // ❌ ถ้าไม่ใช่ admin
//     if (!userId || role !== 'admin') {
//       router.replace('/login');
//       return;
//     }

//     fetch('http://localhost:5000/api/products/stats', {
//       credentials: 'include',
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         setStats(data);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Admin Dashboard</Text>

//       <View style={styles.card}>
//         <Text style={styles.label}>Total Products</Text>
//         <Text style={styles.value}>{stats.totalProducts}</Text>
//       </View>

//       <View style={styles.card}>
//         <Text style={styles.label}>Average Price</Text>
//         <Text style={styles.value}>฿ {stats.avgSalePrice?.toFixed(2)}</Text>
//       </View>

//       <View style={styles.card}>
//         <Text style={styles.label}>Max Price</Text>
//         <Text style={styles.value}>฿ {stats.maxSalePrice?.toFixed(2)}</Text>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f4f6f9',
//   },

//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 25,
//   },

//   card: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 12,
//     marginBottom: 15,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },

//   label: {
//     fontSize: 14,
//     color: '#777',
//   },

//   value: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginTop: 5,
//   },
// });
