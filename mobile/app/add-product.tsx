import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { router } from 'expo-router';

const categories = ['food', 'toy', 'litter', 'accessory', 'health'];

const tagOptions = [
  'dryfood',
  'wetfood',
  'snack',
  'catnip',
  'toy',
  'scratcher',
  'litter',
  'carrier',
  'bed',
  'grooming',
];

export default function AddProduct() {
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [discount, setDiscount] = useState('');

  const [category, setCategory] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  if (!user || (user.role !== 'admin' && user.role !== 'seller')) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>❌ No permission</Text>
      </View>
    );
  }

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleSubmit = async () => {
    if (!name || !price || !category) {
      Alert.alert('Name, price, category required');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          seller_id: user.id,
          name,
          description,
          originalPrice: Number(price),
          discountPercent: Number(discount) || 0,
          stock: Number(stock) || 0,
          category,
          tags,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert('Error', JSON.stringify(data));
        return;
      }

      Alert.alert('Product created');
      router.push('/products');
    } catch (err) {
      Alert.alert('Network error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Product</Text>

      <TextInput
        placeholder="Product name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Description"
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        placeholder="Price"
        style={styles.input}
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <TextInput
        placeholder="Stock"
        style={styles.input}
        keyboardType="numeric"
        value={stock}
        onChangeText={setStock}
      />

      <TextInput
        placeholder="Discount %"
        style={styles.input}
        keyboardType="numeric"
        value={discount}
        onChangeText={setDiscount}
      />

      {/* CATEGORY */}
      <Text style={styles.section}>Category</Text>

      <View style={styles.tagContainer}>
        {categories.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.tag, category === c && styles.tagSelected]}
            onPress={() => setCategory(c)}
          >
            <Text
              style={[styles.tagText, category === c && styles.tagTextSelected]}
            >
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* TAGS */}
      <Text style={styles.section}>Tags</Text>

      <View style={styles.tagContainer}>
        {tagOptions.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tag, tags.includes(t) && styles.tagSelected]}
            onPress={() => toggleTag(t)}
          >
            <Text
              style={[
                styles.tagText,
                tags.includes(t) && styles.tagTextSelected,
              ]}
            >
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Create Product</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#f4f6f9',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  error: {
    fontSize: 20,
    color: 'red',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  input: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
  },

  section: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 8,
  },

  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },

  tag: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 20,
  },

  tagSelected: {
    backgroundColor: '#ff8c42',
  },

  tagText: {
    color: '#333',
  },

  tagTextSelected: {
    color: 'white',
  },

  button: {
    backgroundColor: '#ff8c42',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
