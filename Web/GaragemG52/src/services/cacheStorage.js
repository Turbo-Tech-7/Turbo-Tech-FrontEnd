const readCache = (key) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

const writeCache = (key, value) => {
  if (value == null) {
    localStorage.removeItem(key);
    return;
  }

  localStorage.setItem(key, JSON.stringify(value));
};

const clearCache = (key) => {
  localStorage.removeItem(key);
};

export { readCache, writeCache, clearCache };
