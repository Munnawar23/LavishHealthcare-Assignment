import AsyncStorage from '@react-native-async-storage/async-storage';

// Save data to storage
const save = async (key: string, value: unknown): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error(`Failed to save data for key "${key}"`, e);
  }
};

// Get data from storage
const get = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? (JSON.parse(jsonValue) as T) : null;
  } catch (e) {
    console.error(`Failed to retrieve data for key "${key}"`, e);
    return null;
  }
};

// Remove data from storage
const remove = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error(`Failed to remove data for key "${key}"`, e);
  }
};

// Export storage utility
export const storage = {
  save,
  get,
  remove,
};
