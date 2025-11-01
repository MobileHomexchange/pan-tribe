// src/hooks/useSavedItems.ts
import { useCallback, useMemo, useState } from "react";

type SavedItemType = "post" | "event" | "user";

export interface SavedItem {
  id: string;
  type: SavedItemType;
  title?: string;
  image?: string;
}

const KEY = "tribepulse:saved";

function read(): SavedItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SavedItem[]) : [];
  } catch {
    return [];
  }
}

function write(items: SavedItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch { /* ignore */ }
}

export function useSavedItems() {
  const [items, setItems] = useState<SavedItem[]>(() => read());

  const isSaved = useCallback((id: string) => {
    return items.some((i) => i.id === id);
  }, [items]);

  const toggleSave = useCallback((item: SavedItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      const next = exists ? prev.filter((i) => i.id !== item.id) : [...prev, item];
      write(next);
      return next;
    });
  }, []);

  const getSavedItemsByType = useCallback((type: SavedItemType) => {
    return items.filter((i) => i.type === type);
  }, [items]);

  return useMemo(
    () => ({ items, isSaved, toggleSave, getSavedItemsByType }),
    [items, isSaved, toggleSave, getSavedItemsByType]
  );
}
