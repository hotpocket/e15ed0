import { useState, useCallback } from 'react';
import type { FormItem } from '~/types/FormTypes';

export const useFormItems = (initialItems: FormItem[]) => {
  const [items, setItems] = useState<FormItem[]>(initialItems);

  const updateItem = useCallback((name: string, updates: Partial<FormItem>): void => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.name === name ? { ...item, ...updates } : item
      )
    );
  }, []);

  return {
    items,
    setItems,
    updateItem
  };
};