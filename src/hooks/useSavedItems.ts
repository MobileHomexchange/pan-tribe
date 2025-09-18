import { useState, useCallback, useEffect } from 'react';

export interface SavedItem {
  id: string;
  title: string;
  type: 'event' | 'blog' | 'marketplace' | 'video' | 'post';
  image?: string;
  savedAt: Date;
  description?: string;
  author?: string;
  location?: string;
}

export function useSavedItems() {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

  // Load saved items from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('tribePulseSavedItems');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSavedItems(parsed.map((item: any) => ({
          ...item,
          savedAt: new Date(item.savedAt)
        })));
      } catch (error) {
        console.error('Error loading saved items:', error);
      }
    }
  }, []);

  // Save to localStorage whenever savedItems changes
  useEffect(() => {
    localStorage.setItem('tribePulseSavedItems', JSON.stringify(savedItems));
  }, [savedItems]);

  const saveItem = useCallback((item: Omit<SavedItem, 'savedAt'>) => {
    setSavedItems(prev => {
      // Check if already saved
      if (prev.some(saved => saved.id === item.id)) {
        return prev;
      }
      
      const newItem: SavedItem = {
        ...item,
        savedAt: new Date()
      };
      
      return [newItem, ...prev];
    });
  }, []);

  const unsaveItem = useCallback((id: string) => {
    setSavedItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const isSaved = useCallback((id: string) => {
    return savedItems.some(item => item.id === id);
  }, [savedItems]);

  const toggleSave = useCallback((item: Omit<SavedItem, 'savedAt'>) => {
    if (isSaved(item.id)) {
      unsaveItem(item.id);
    } else {
      saveItem(item);
    }
  }, [isSaved, saveItem, unsaveItem]);

  const getSavedItemsByType = useCallback((type?: SavedItem['type']) => {
    if (!type) return savedItems;
    return savedItems.filter(item => item.type === type);
  }, [savedItems]);

  return {
    savedItems,
    saveItem,
    unsaveItem,
    isSaved,
    toggleSave,
    getSavedItemsByType,
    savedCount: savedItems.length
  };
}