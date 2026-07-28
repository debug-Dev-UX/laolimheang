// LocalStorage Helper Functions
const PREFIX = 'laolimheang_';

export const setItem = (key, value) => {
  try {
    const prefixedKey = PREFIX + key;
    const serialized = JSON.stringify(value);
    localStorage.setItem(prefixedKey, serialized);
  } catch (error) {
    console.error(`Error setting item ${key}:`, error);
  }
};

export const getItem = (key, defaultValue = null) => {
  try {
    const prefixedKey = PREFIX + key;
    const item = localStorage.getItem(prefixedKey);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting item ${key}:`, error);
    return defaultValue;
  }
};

export const removeItem = (key) => {
  try {
    const prefixedKey = PREFIX + key;
    localStorage.removeItem(prefixedKey);
  } catch (error) {
    console.error(`Error removing item ${key}:`, error);
  }
};

export const clear = () => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

export const getAllItems = () => {
  try {
    const items = {};
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(PREFIX)) {
        const unprefixedKey = key.replace(PREFIX, '');
        items[unprefixedKey] = JSON.parse(localStorage.getItem(key));
      }
    });
    return items;
  } catch (error) {
    console.error('Error getting all items:', error);
    return {};
  }
};
