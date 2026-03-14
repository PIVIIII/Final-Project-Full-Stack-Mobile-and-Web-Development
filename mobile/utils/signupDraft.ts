import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'signup-draft';

export const saveDraft = async (data: any) => {
  await AsyncStorage.setItem(KEY, JSON.stringify(data));
};

export const loadDraft = async () => {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : {};
};

export const clearDraft = async () => {
  await AsyncStorage.removeItem(KEY);
};
