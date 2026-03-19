import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '../api/apiService';
import type { Item, CreateItemRequest, UpdateItemRequest } from '../types/models';

interface ItemsContextType {
  items: Item[];
  loading: boolean;
  error: string | null;
  
  // Actions
  refreshItems: () => Promise<void>;
  createItem: (data: CreateItemRequest) => Promise<void>;
  updateItem: (id: number, data: UpdateItemRequest) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export function ItemsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pobranie wszystkich produktów
  const refreshItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getItems();
      setItems(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Failed to load items:', err);
    } finally {
      setLoading(false);
    }
  };

  // Tworzenie produktu
  const createItem = async (data: CreateItemRequest) => {
    try {
      setError(null);
      await apiService.createItem(data);
      
      // Odśwież listę z API aby pobrać pełne dane (categoryName, unitName)
      await refreshItems();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    }
  };

  // Aktualizacja produktu
  const updateItem = async (id: number, data: UpdateItemRequest) => {
    try {
      setError(null);
      await apiService.updateItem(id, data);
      
      // Odśwież listę z API aby pobrać pełne dane (categoryName, unitName)
      await refreshItems();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    }
  };

  // Usunięcie produktu
  const deleteItem = async (id: number) => {
    try {
      setError(null);
      await apiService.deleteItem(id);
      
      // Usuń lokalnie
      setItems(prev => prev.filter(item => item.idItem !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    }
  };

  // Załaduj produkty przy montowaniu
  useEffect(() => {
    refreshItems();
  }, []);

  return (
    <ItemsContext.Provider
      value={{
        items,
        loading,
        error,
        refreshItems,
        createItem,
        updateItem,
        deleteItem,
      }}
    >
      {children}
    </ItemsContext.Provider>
  );
}

export function useItems() {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error('useItems must be used within ItemsProvider');
  }
  return context;
}