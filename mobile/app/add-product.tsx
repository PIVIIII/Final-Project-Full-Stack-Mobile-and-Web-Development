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
import { useState, useEffect } from 'react';
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

const MAX_RUNNING = 2;

type UploadImage = {
  id: number;
  uri: string;
  base64?: string;
  status: 'pending' | 'running' | 'completed';
  progress: number;
};

export default function AddProduct() {
  const { userId, role } = useAuth();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [discount, setDiscount] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<UploadImage[]>([]);
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
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const validate = () => {
    let newErrors: any = {};

    if (!name) newErrors.name = 'Product name required';
    if (!price) newErrors.price = 'Price required';
    if (!category) newErrors.category = 'Category required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
      const newImg: UploadImage = {
        id: Date.now(),
        uri: result.assets[0].uri,
        status: 'pending',
        progress: 0,
      };

      setImages((prev) => [...prev, newImg]);
    }
  };

  const removeImage = (id: number) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const uploadImage = async (img: UploadImage) => {
    const base64 = await convertToBase64(img.uri);

    let progress = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 20;

      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        setImages((prev) =>
          prev.map((i) =>
            i.id === img.id
              ? { ...i, base64, status: 'completed', progress: 100 }
              : i,
          ),
        );
      } else {
        setImages((prev) =>
          prev.map((i) => (i.id === img.id ? { ...i, progress } : i)),
        );
      }
    }, 400);
  };

  const startNextUpload = () => {
    setImages((prev) => {
      const running = prev.filter((i) => i.status === 'running').length;

      if (running >= MAX_RUNNING) return prev;

      const nextIndex = prev.findIndex((i) => i.status === 'pending');

      if (nextIndex === -1) {
        return prev;
      }

      const updated = [...prev];

      const next = {
        ...updated[nextIndex],
        status: 'running' as const,
      };

      updated[nextIndex] = next;

      uploadImage(next);

      return updated;
    });
  };

  useEffect(() => {
    startNextUpload();
  }, [images]);

  const handleSubmit = async () => {
    if (!validate()) return;

    const completedImages = images
      .filter((i) => i.status === 'completed')
      .map((i) => i.base64);

    if (completedImages.length < 1) {
      Alert.alert('Please upload at least 1 image');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');

      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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
          images: completedImages,
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

        <Text style={styles.section}>Images (max 5)</Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {images.map((img) => (
            <View key={img.id} style={{ alignItems: 'center' }}>
              <TouchableOpacity onPress={() => removeImage(img.id)}>
                <Image
                  source={{ uri: img.uri }}
                  style={{ width: 80, height: 80, borderRadius: 10 }}
                />
              </TouchableOpacity>

              <Text>
                {img.status === 'pending' && 'waiting'}
                {img.status === 'running' && 'uploading'}
                {img.status === 'completed' && 'done'}
              </Text>

              {img.status === 'running' && (
                <View style={styles.progressBar}>
                  <View
                    style={[styles.progressFill, { width: `${img.progress}%` }]}
                  />
                </View>
              )}
            </View>
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

  progressBar: {
    width: 80,
    height: 6,
    backgroundColor: '#ddd',
    marginTop: 4,
    borderRadius: 4,
  },

  progressFill: {
    height: 6,
    backgroundColor: '#ff8c42',
    borderRadius: 4,
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
