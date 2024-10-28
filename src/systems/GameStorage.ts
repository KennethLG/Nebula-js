const storage = localStorage;

export const getItem = (key: string): string | null => {
  const item = storage.getItem(key);
  if (item == null) return null;
  return JSON.parse(item);
};

export const setItem = (key: string, value: any): void => {
  storage.setItem(key, JSON.stringify(value));
};
