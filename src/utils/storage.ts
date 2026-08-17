import CryptoJS from "crypto-js";

import { STORAGE_SECRET } from "@/constants";

import { isClient } from "./isClient";

const encodeData = (data: unknown): string => {
  try {
    const jsonString = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonString, STORAGE_SECRET).toString();
  } catch {
    return "";
  }
};

const decodeData = (encodedString: string | null): unknown => {
  if (!encodedString) return null;
  try {
    const bytes = CryptoJS.AES.decrypt(encodedString, STORAGE_SECRET);
    const jsonString = bytes.toString(CryptoJS.enc.Utf8);
    if (!jsonString) return null;
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
};

export const storage = {
  setItemEncoded: (key: string, value: unknown): void => {
    if (!isClient()) return;
    try {
      const encoded = encodeData(value);
      localStorage.setItem(key, encoded);
    } catch {
      // Silently handle storage error
    }
  },

  getItemDecoded: (key: string): unknown => {
    if (!isClient()) return null;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return decodeData(raw);
    } catch {
      return null;
    }
  },

  removeItem: (key: string): void => {
    if (!isClient()) return;
    try {
      localStorage.removeItem(key);
    } catch {
      // Silently handle storage error
    }
  },

  clearStorage: (): void => {
    if (!isClient()) return;
    try {
      localStorage.clear();
    } catch {
      // Silently handle storage error
    }
  },
};
