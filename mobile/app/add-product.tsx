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
  Image,
} from 'react-native';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { router } from 'expo-router';
import CurrencyCard from '../components/ui/CurrencyCard';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const { userId, role } = useAuth();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [discount, setDiscount] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<any>({});
  const [thb, setThb] = useState('');

  const thbValue = parseFloat(thb) || 0;
  const discount1 = (thbValue * 0.95).toFixed(2);
  const discount2 = (thbValue * 0.9).toFixed(2);
  const discount3 = (thbValue * 0.8).toFixed(2);

  if (!userId || (role !== 'admin' && role !== 'seller')) {
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

  // convert image -> base64
  const convertToBase64 = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  };

  const pickImage = async () => {
    if (images.length >= 5) {
      Alert.alert('Maximum 5 images allowed');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      const base64 = await convertToBase64(result.assets[0].uri);
      setImages([...images, base64]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    if (images.length < 1) {
      Alert.alert('Please upload at least 1 image');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');

      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // ⭐ ส่ง token
        },
        body: JSON.stringify({
          seller_id: userId,
          name,
          description,
          originalPrice: Number(price),
          discountPercent: Number(discount) || 0,
          stock: Number(stock) || 0,
          category,
          tags,
          images,
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
      <ScrollView style={styles.container}>
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
          onChangeText={(v) => numberOnly(v, setPrice)}
        />

        <TextInput
          placeholder="Stock"
          style={styles.input}
          keyboardType="numeric"
          value={stock}
          onChangeText={(v) => numberOnly(v, setStock)}
        />

        <TextInput
          placeholder="Discount %"
          style={styles.input}
          keyboardType="numeric"
          value={discount}
          onChangeText={(v) => numberOnly(v, setDiscount)}
        />

        <Text style={styles.section}>Category</Text>

        <View style={styles.tagContainer}>
          {categories.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.tag, category === c && styles.tagSelected]}
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

        <Text style={styles.section}>Images (1-5)</Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {images.map((img, i) => (
            <TouchableOpacity key={i} onPress={() => removeImage(i)}>
              <Image
                source={{ uri: img }}
                style={{ width: 80, height: 80, borderRadius: 10 }}
              />
            </TouchableOpacity>
          ))}

          {images.length < 5 && (
            <TouchableOpacity style={styles.addImg} onPress={pickImage}>
              <Text>+ Add</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Create Product</Text>
        </TouchableOpacity>

        <Text style={{ marginTop: 30, fontSize: 20, fontWeight: 'bold' }}>
          คำนวณราคาลด จาก discount %
        </Text>

        <TextInput
          placeholder="THB price"
          keyboardType="numeric"
          style={styles.input}
          value={thb}
          onChangeText={(v) => numberOnly(v, setThb)}
        />

        <CurrencyCard label="ลด 5%" value={`${discount1}`} />
        <CurrencyCard label="ลด 10%" value={`${discount2}`} />
        <CurrencyCard label="ลด 20%" value={`${discount3}`} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, backgroundColor: '#f4f6f9' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },

  input: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 10,
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
    marginTop: 20,
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  addImg: {
    width: 80,
    height: 80,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
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
});
