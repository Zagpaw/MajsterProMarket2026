// Jednostka miary
export interface UnitOfMeasurement {
  idUnitOfMeasurement: number;
  name: string | null;
  description: string | null;
  isActive: boolean;
}

// Kategoria
export interface Category {
  idCategory: number;
  name: string | null;
  description: string | null;
  isActive: boolean;
}

// Klient
export interface Client {
  idClient: number;
  name: string | null;
  adress: string | null;  // Typo w bazie - zostawiamy
  phoneNumber: string | null;
  isActive: boolean;
}

// Pracownik
export interface Worker {
  idWorker: number;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
  login: string;
  password?: string;
}

// Produkt (ItemDto z backendu)
export interface Item {
  idItem: number;
  name: string | null;
  description: string | null;
  idCategory: number;
  categoryName: string | null;
  price: number | null;
  quantity: number | null;
  idUnitOfMeasurement: number | null;
  unitName: string | null;
  code: string | null;
  isActive: boolean;
}

// Request types (dla Create/Update)
export interface CreateItemRequest {
  name: string;
  description?: string;
  idCategory: number;
  price?: number;
  quantity?: number;
  fotoUrl?: string;
  idUnitOfMeasurement?: number;
  code?: string;
}

export interface UpdateItemRequest extends CreateItemRequest {
  idItem: number;
  isActive: boolean;
}