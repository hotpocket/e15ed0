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

    const getItem = useCallback((name: string): FormItem => {
      for (const item of items) {
        if (item?.name === name) {
          return item;
        }
      }
      return {name:"",type:'unmapped', selected:false}
  }, [items]);


  return {
    items,
    getItem,
    setItems,
    updateItem
  };
};