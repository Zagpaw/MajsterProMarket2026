
import { API_BASE_URL } from './config';
import type {
  UnitOfMeasurement,
  Category,
  Client,
  Worker,
  Item,
  CreateItemRequest,
  UpdateItemRequest,
} from '../types/models';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Generyczny request handler
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    // Create a Headers instance when available (covers Headers | string[][] | Record).
    // If a Headers constructor isn't present in the runtime/types, fall back to
    // a plain object merge so `fetch` still receives headers in an acceptable shape.
    const HeadersCtor = (globalThis as any).Headers;
    let headers: any;
    if (HeadersCtor) {
      headers = new HeadersCtor(options.headers as any);
      if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }
    } else {
      headers = {
        'Content-Type': 'application/json',
        ...(options.headers as any),
      };
    }

    try {
      console.log(`API Request: ${options.method || 'GET'} ${url}`);

      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Sprawdzenie statusu
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP ${response.status}: ${errorText || response.statusText}`
        );
      }

      // Jeśli 204 No Content - nie parsuj JSON
      if (response.status === 204) {
        return {} as T;
      }

      const data = await response.json();
      console.log(`API Response:`, data);
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // ========== JEDNOSTKI MIARY ==========

  async getUnitOfMeasurements(): Promise<UnitOfMeasurement[]> {
    return this.request<UnitOfMeasurement[]>('/UnitOfMeasurements');
  }

  async getUnitOfMeasurement(id: number): Promise<UnitOfMeasurement> {
    return this.request<UnitOfMeasurement>(`/UnitOfMeasurements/${id}`);
  }

  async createUnitOfMeasurement(
    data: Omit<UnitOfMeasurement, 'idUnitOfMeasurement'>
  ): Promise<{ id: number }> {
    return this.request<{ id: number }>('/UnitOfMeasurements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUnitOfMeasurement(
    id: number,
    data: Partial<UnitOfMeasurement>
  ): Promise<void> {
    return this.request<void>(`/UnitOfMeasurements/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, idUnitOfMeasurement: id }),
    });
  }

  async deleteUnitOfMeasurement(id: number): Promise<void> {
    return this.request<void>(`/UnitOfMeasurements/${id}`, {
      method: 'DELETE',
    });
  }

  // ========== KATEGORIE ==========

  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/Categories');
  }

  async createCategory(
    data: Omit<Category, 'idCategory'>
  ): Promise<{ id: number }> {
    return this.request<{ id: number }>('/Categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(
    id: number,
    data: Partial<Category>
  ): Promise<void> {
    return this.request<void>(`/Categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, idCategory: id }),
    });
  }

  async deleteCategory(id: number): Promise<void> {
    return this.request<void>(`/Categories/${id}`, {
      method: 'DELETE',
    });
  }

  // ========== PRODUKTY (ITEMS) ==========

  async getItems(): Promise<Item[]> {
    return this.request<Item[]>('/Item');
  }

  async getItem(id: number): Promise<Item> {
    return this.request<Item>(`/Item/${id}`);
  }

  async createItem(data: CreateItemRequest): Promise<{ id: number }> {
    return this.request<{ id: number }>('/Item', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateItem(id: number, data: UpdateItemRequest): Promise<void> {
    return this.request<void>(`/Item/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteItem(id: number): Promise<void> {
    return this.request<void>(`/Item/${id}`, {
      method: 'DELETE',
    });
  }

  // ========== KLIENCI ==========

  async getClients(): Promise<Client[]> {
    return this.request<Client[]>('/Client');
  }

  async createClient(data: Omit<Client, 'idClient'>): Promise<{ id: number }> {
    return this.request<{ id: number }>('/Client', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ========== PRACOWNICY ==========

  async getWorkers(): Promise<Worker[]> {
    return this.request<Worker[]>('/Worker');
  }

  async createWorker(data: Omit<Worker, 'idWorker'>): Promise<{ id: number }> {
    return this.request<{ id: number }>('/Worker', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}


// Singleton
export default new ApiService(); 
