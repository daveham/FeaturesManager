import AsyncStorage from '@react-native-async-storage/async-storage';

import log from 'shared/utilities/logger';

export const readFromLocalStorage = async key => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    log.warn('exception in readFromLocalStorage', error);
    throw error;
  }
};

export const removeFromLocalStorage = async key => {
  try {
    return await AsyncStorage.removeItem(key);
  } catch (error) {
    log.warn('exception in removeFromLocalStorage', error);
    throw error;
  }
};

export const writeToLocalStorage = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    log.warn('exception in writeToLocalStorage', error);
    throw error;
  }
};
