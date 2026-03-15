import type { Item } from '../types/models';

export type RootStackParamList = {
  Home: undefined;
  Items: undefined;
  CreateItem: undefined;
  EditItem: { item: Item };
  Categories: undefined;
  Units: undefined;
  Clients: undefined;
  Workers: undefined;
  Orders: undefined;
  CreateOrder: undefined;
  EditOrder: { orderId: number };
};