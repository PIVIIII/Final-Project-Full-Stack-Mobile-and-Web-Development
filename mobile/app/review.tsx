import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

import { useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../constants/api';

export default function ReviewPage() {
  const params = useLocalSearchParams();

  const productId = params.productId as string;
  const name = params.name as string;
  const image = params.image as string;

  const { userId } = useAuth();

  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);

  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/reviews/user/${userId}/product/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setComment(data.comment);
          setRating(data.rating);
          setIsEdit(true);
        }
      });
  }, []);

  const submitReview = async () => {
    await fetch(`${API_URL}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        product_id: productId,
        rating,
        comment,
      }),
    });

    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={{ uri: image }} style={styles.image} />

        <View style={styles.right}>
          <Text style={styles.title}>{name}</Text>

          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((n) => (
              <TouchableOpacity key={n} onPress={() => setRating(n)}>
                <Text style={styles.star}>{rating >= n ? '⭐' : '☆'}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.input}
            multiline
            placeholder="Write review..."
            value={comment}
            onChangeText={setComment}
          />

          <TouchableOpacity style={styles.btn} onPress={submitReview}>
            <Text style={styles.btnText}>
              {isEdit ? 'Update Review' : 'Submit Review'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },

  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
  },

  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },

  right: {
    flex: 1,
    marginLeft: 15,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  starRow: {
    flexDirection: 'row',
    marginVertical: 10,
  },

  star: {
    fontSize: 26,
    marginRight: 5,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    height: 80,
  },

  btn: {
    marginTop: 10,
    backgroundColor: '#ff8c42',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  btnText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
