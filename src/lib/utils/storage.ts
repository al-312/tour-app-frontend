import { isClient } from "./is-client";
import { STORAGE_SECRET } from "../constants/app.constants";

const encodeValue = (value: unknown): string => {
  try {
    const jsonStr = JSON.stringify(value);
    return isClient() ? window.btoa(encodeURIComponent(jsonStr)) : jsonStr;
  } catch {
    return String(value);
  }
};

const decodeValue = (encoded: string): unknown => {
  try {
    const jsonStr = isClient() ? decodeURIComponent(window.atob(encoded)) : encoded;
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
};

export const storage = {
  getItemDecoded: (key: string): unknown => {
    if (!isClient()) return null;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return decodeValue(raw);
    } catch {
      return null;
    }
  },

  setItemEncoded: (key: string, value: unknown): void => {
    if (!isClient()) return;
    try {
      const encoded = encodeValue(value);
      localStorage.setItem(key, encoded);
    } catch {
      // noop
    }
  },

  removeItem: (key: string): void => {
    if (!isClient()) return;
    try {
      localStorage.removeItem(key);
    } catch {
      // noop
    }
  },

  clearStorage: (): void => {
    if (!isClient()) return;
    try {
      localStorage.clear();
    } catch {
      // noop
    }
  },

  getSecretKey: (): string => STORAGE_SECRET,
};
