import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

type Review = {
  _id: string;
  comment: string;
  rating: number;
  sellerReply?: string;
  user_id: {
    username: string;
  };
  product_id: {
    name: string;
    images?: string[];
  };
};

export default function SellerReviews() {
  const { userId } = useAuth();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/reviews/seller/${userId}`)
      .then((res) => res.json())
      .then(setReviews);
  }, [userId]);

  const submitReply = async (reviewId: string) => {
    await fetch(`http://localhost:5000/api/reviews/reply/${reviewId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reply: replyText[reviewId],
      }),
    });

    setReviews((prev) =>
      prev.map((r) =>
        r._id === reviewId ? { ...r, sellerReply: replyText[reviewId] } : r,
      ),
    );
  };

  const renderItem = ({ item }: { item: Review }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.product_id?.images?.[0] }}
        style={styles.image}
      />

      <View style={styles.info}>
        <Text style={styles.product}>{item.product_id?.name}</Text>

        <Text>User: {item.user_id?.username}</Text>

        <Text>{'⭐'.repeat(item.rating)}</Text>

        <Text style={styles.comment}>{item.comment}</Text>

        {item.sellerReply && (
          <View style={styles.replyBox}>
            <Text>Seller: {item.sellerReply}</Text>
          </View>
        )}

        <TextInput
          placeholder="Write reply..."
          style={styles.input}
          value={replyText[item._id] || ''}
          onChangeText={(text) =>
            setReplyText((prev) => ({ ...prev, [item._id]: text }))
          }
        />

        <TouchableOpacity
          style={styles.replyBtn}
          onPress={() => submitReply(item._id)}
        >
          <Text style={{ color: 'white' }}>Reply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Reviews</Text>

      <FlatList
        data={reviews}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f6f6f6',
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
  },

  info: {
    flex: 1,
  },

  product: {
    fontWeight: 'bold',
    fontSize: 16,
  },

  comment: {
    marginVertical: 6,
  },

  replyBox: {
    backgroundColor: '#eee',
    padding: 6,
    borderRadius: 6,
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    marginBottom: 6,
  },

  replyBtn: {
    backgroundColor: '#ff8c42',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
});
