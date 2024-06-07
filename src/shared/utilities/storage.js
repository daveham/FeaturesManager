import AsyncStorage from '@react-native-async-storage/async-storage';

export const readFromLocalStorage = async key => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.warn('exception in readFromLocalStorage', error);
    throw error;
  }
};

export const removeFromLocalStorage = async key => {
  try {
    return await AsyncStorage.removeItem(key);
  } catch (error) {
    console.warn('exception in removeFromLocalStorage', error);
    throw error;
  }
};

export const writeToLocalStorage = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.warn('exception in writeToLocalStorage', error);
    throw error;
  }
};
