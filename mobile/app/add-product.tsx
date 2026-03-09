import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { router } from 'expo-router';
import CurrencyCard from '../components/ui/CurrencyCard';

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

  const [errors, setErrors] = useState<any>({});
  const [thb, setThb] = useState('');

  const thbValue = parseFloat(thb) || 0;

  const usd = (thbValue * 0.028).toFixed(2);
  const eur = (thbValue * 0.026).toFixed(2);
  const jpy = (thbValue * 4.1).toFixed(2);
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

  const validate = () => {
    let newErrors: any = {};

    if (!name) newErrors.name = 'Product name required';
    if (!price) newErrors.price = 'Price required';
    if (!category) newErrors.category = 'Category required';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

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

  const numberOnly = (value: string, setter: any) => {
    const filtered = value.replace(/[^0-9]/g, '');
    setter(filtered);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {' '}
        <Text style={styles.title}>Add Product</Text>
        {/* NAME */}
        <TextInput
          placeholder="Product name"
          style={[styles.input, errors.name && styles.inputError]}
          value={name}
          onChangeText={setName}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        {/* DESCRIPTION */}
        <TextInput
          placeholder="Description"
          style={styles.input}
          value={description}
          onChangeText={setDescription}
        />
        {/* PRICE */}
        <TextInput
          placeholder="Price"
          style={[styles.input, errors.price && styles.inputError]}
          keyboardType="numeric"
          value={price}
          onChangeText={(v) => numberOnly(v, setPrice)}
        />
        {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
        {/* STOCK */}
        <TextInput
          placeholder="Stock"
          style={styles.input}
          keyboardType="numeric"
          value={stock}
          onChangeText={(v) => numberOnly(v, setStock)}
        />
        {/* DISCOUNT */}
        <TextInput
          placeholder="Discount %"
          style={styles.input}
          keyboardType="numeric"
          value={discount}
          onChangeText={(v) => numberOnly(v, setDiscount)}
        />
        {/* CATEGORY */}
        <Text style={styles.section}>Category</Text>
        <View style={styles.tagContainer}>
          {categories.map((c) => (
            <TouchableOpacity
              key={c}
              style={[
                styles.tag,
                category === c && styles.tagSelected,
                errors.category && styles.tagError,
              ]}
              onPress={() => setCategory(c)}
            >
              <Text
                style={[
                  styles.tagText,
                  category === c && styles.tagTextSelected,
                ]}
              >
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.category && (
          <Text style={styles.errorText}>{errors.category}</Text>
        )}
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
        <Text style={{ marginTop: 30, fontSize: 20, fontWeight: 'bold' }}>
          ลองคำนวณราคาขายในสกุลอื่นๆ 🌍
        </Text>
        <TextInput
          placeholder="THB price"
          keyboardType="numeric"
          style={styles.input}
          value={thb}
          onChangeText={(v) => numberOnly(v, setThb)}
        />{' '}
        <CurrencyCard label="USD" value={`$ ${usd}`} />
        <CurrencyCard label="EUR" value={`€ ${eur}`} />
        <CurrencyCard label="JPY" value={`¥ ${jpy}`} />
      </ScrollView>
    </KeyboardAvoidingView>
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
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  inputError: {
    borderColor: 'red',
  },

  errorText: {
    color: 'red',
    marginBottom: 10,
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

  tagError: {
    borderWidth: 1,
    borderColor: 'red',
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
