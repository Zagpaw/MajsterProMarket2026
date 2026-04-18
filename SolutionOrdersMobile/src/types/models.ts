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
  address: string | null;
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

// Dostawca
export interface Supplier {
  idSupplier: number;
  name: string | null;
  contactEmail: string | null;
  phoneNumber: string | null;
  isActive: boolean;
}

// Marka
export interface Brand {
  idBrand: number;
  name: string | null;
  description: string | null;
  isActive: boolean;
}

// Magazyn
export interface Warehouse {
  idWarehouse: number;
  name: string | null;
  location: string | null;
  isActive: boolean;
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
  idSupplier: number | null;
  supplierName: string | null;
  idBrand: number | null;
  brandName: string | null;
  idWarehouse: number | null;
  warehouseName: string | null;
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
  idSupplier?: number;
  idBrand?: number;
  idWarehouse?: number;
  code?: string;
}

export interface UpdateItemRequest extends CreateItemRequest {
  idItem: number;
  isActive: boolean;
}

// Zamowienie
export interface Order {
  idOrder: number;
  dataOrder: string | null;
  idClient: number | null;
  idWorker: number | null;
  notes: string | null;
  deliveryDate: string | null;
}

// Pozycja zamowienia
export interface OrderItem {
  idOrderItem: number;
  idOrder: number;
  idItem: number;
  quantity: number | null;
  isActive: boolean;
}
