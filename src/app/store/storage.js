export const setStorageItem = (key, value) => {
  console.log("eeee", key, value);

  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error("Error saving to localStorage", error);
  }
};

export const getStorageItem = (key) => {
  try {
    if (typeof window !== "undefined") {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
    return null;
  } catch (error) {
    console.error("Error getting from localStorage", error);
    return null;
  }
};

export const removeStorageItem = (key) => {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key);
    }
  } catch (error) {
    console.error("Error removing from localStorage", error);
  }
};
