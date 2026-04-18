
import { API_BASE_URL } from './config';
import type {
  UnitOfMeasurement,
  Category,
  Client,
  Worker,
  Supplier,
  Brand,
  Warehouse,
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

  async getEntityList<T>(endpoint: string): Promise<T[]> {
    return this.request<T[]>(endpoint);
  }

  async createEntity<TRequest, TResponse = unknown>(
    endpoint: string,
    data: TRequest
  ): Promise<TResponse> {
    return this.request<TResponse>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEntity<TRequest>(
    endpoint: string,
    id: number,
    data: TRequest
  ): Promise<void> {
    return this.request<void>(`${endpoint}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEntity(endpoint: string, id: number): Promise<void> {
    return this.request<void>(`${endpoint}/${id}`, {
      method: 'DELETE',
    });
  }

  // ========== JEDNOSTKI MIARY ==========

  async getUnitOfMeasurements(): Promise<UnitOfMeasurement[]> {
    return this.request<UnitOfMeasurement[]>('/UnitOfMeasurement');
  }

  async getUnitOfMeasurement(id: number): Promise<UnitOfMeasurement> {
    return this.request<UnitOfMeasurement>(`/UnitOfMeasurement/${id}`);
  }

  async createUnitOfMeasurement(
    data: Omit<UnitOfMeasurement, 'idUnitOfMeasurement'>
  ): Promise<{ id: number }> {
    return this.request<{ id: number }>('/UnitOfMeasurement', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUnitOfMeasurement(
    id: number,
    data: Partial<UnitOfMeasurement>
  ): Promise<void> {
    return this.request<void>(`/UnitOfMeasurement/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, idUnitOfMeasurement: id }),
    });
  }

  async deleteUnitOfMeasurement(id: number): Promise<void> {
    return this.request<void>(`/UnitOfMeasurement/${id}`, {
      method: 'DELETE',
    });
  }

  // ========== KATEGORIE ==========

  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/Category');
  }

  async createCategory(
    data: Omit<Category, 'idCategory'>
  ): Promise<{ id: number }> {
    return this.request<{ id: number }>('/Category', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(
    id: number,
    data: Partial<Category>
  ): Promise<void> {
    return this.request<void>(`/Category/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, idCategory: id }),
    });
  }

  async deleteCategory(id: number): Promise<void> {
    return this.request<void>(`/Category/${id}`, {
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

  async updateClient(id: number, data: Partial<Client>): Promise<void> {
    return this.request<void>(`/Client/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, idClient: id }),
    });
  }

  async deleteClient(id: number): Promise<void> {
    return this.request<void>(`/Client/${id}`, {
      method: 'DELETE',
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

  async updateWorker(id: number, data: Partial<Worker>): Promise<void> {
    return this.request<void>(`/Worker/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, idWorker: id }),
    });
  }

  async deleteWorker(id: number): Promise<void> {
    return this.request<void>(`/Worker/${id}`, {
      method: 'DELETE',
    });
  }

  // ========== DOSTAWCY ==========

  async getSuppliers(): Promise<Supplier[]> {
    return this.request<Supplier[]>('/Supplier');
  }

  async createSupplier(data: Omit<Supplier, 'idSupplier'>): Promise<{ id: number }> {
    return this.request<{ id: number }>('/Supplier', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSupplier(id: number, data: Partial<Supplier>): Promise<void> {
    return this.request<void>(`/Supplier/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, idSupplier: id }),
    });
  }

  async deleteSupplier(id: number): Promise<void> {
    return this.request<void>(`/Supplier/${id}`, {
      method: 'DELETE',
    });
  }

  // ========== MARKI ==========

  async getBrands(): Promise<Brand[]> {
    return this.request<Brand[]>('/Brand');
  }

  async createBrand(data: Omit<Brand, 'idBrand'>): Promise<{ id: number }> {
    return this.request<{ id: number }>('/Brand', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBrand(id: number, data: Partial<Brand>): Promise<void> {
    return this.request<void>(`/Brand/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, idBrand: id }),
    });
  }

  async deleteBrand(id: number): Promise<void> {
    return this.request<void>(`/Brand/${id}`, {
      method: 'DELETE',
    });
  }

  // ========== MAGAZYNY ==========

  async getWarehouses(): Promise<Warehouse[]> {
    return this.request<Warehouse[]>('/Warehouse');
  }

  async createWarehouse(data: Omit<Warehouse, 'idWarehouse'>): Promise<{ id: number }> {
    return this.request<{ id: number }>('/Warehouse', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateWarehouse(id: number, data: Partial<Warehouse>): Promise<void> {
    return this.request<void>(`/Warehouse/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, idWarehouse: id }),
    });
  }

  async deleteWarehouse(id: number): Promise<void> {
    return this.request<void>(`/Warehouse/${id}`, {
      method: 'DELETE',
    });
  }
}


// Singleton
export default new ApiService(); 
