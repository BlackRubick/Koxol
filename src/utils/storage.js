// Helper seguro para trabajar con localStorage y JSON
export function getJSON(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`getJSON error for key ${key}:`, err);
    return defaultValue;
  }
}

export function setJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`setJSON error for key ${key}:`, err);
    return false;
  }
}

export function removeKey(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (err) {
    console.error(`removeKey error for key ${key}:`, err);
    return false;
  }
}

export default { getJSON, setJSON, removeKey };
