import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import apiService from '../api/apiService';
import type { Client, Item, Order } from '../types/models';

type CustomerHomeProps = {
  client: Client;
  onLogout: () => void;
};

type CartLine = {
  item: Item;
  quantity: number;
};

type CustomerTab = 'catalog' | 'cart' | 'orders';
type PaymentMethod = 'Odbior' | 'Karta';

const heroImage = require('../assets/images/sklep.jpg');

const normalizeCardNumber = (value: string): string => value.replace(/\D/g, '');

const formatCardNumber = (value: string): string =>
  normalizeCardNumber(value)
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim();

const validateCardNumber = (value: string): string => {
  const digits = normalizeCardNumber(value);

  if (!digits) {
    return 'Pole Numer karty testowej nie jest wypełnione. Wpisz 16 cyfr.';
  }

  if (digits.length !== 16) {
    return `Numer karty testowej musi mieć dokładnie 16 cyfr. Teraz wpisano: ${digits.length}.`;
  }

  return '';
};

function CustomerHome({ client, onLogout }: CustomerHomeProps): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<CustomerTab>('catalog');
  const [items, setItems] = useState<Item[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<Record<number, CartLine>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Odbior');
  const [cardNumber, setCardNumber] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Wszystko');
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cartLines = useMemo(() => Object.values(cart), [cart]);
  const cartTotal = useMemo(
    () => cartLines.reduce((sum, line) => sum + (line.item.price ?? 0) * line.quantity, 0),
    [cartLines]
  );
  const categoryOptions = useMemo(() => {
    const categories = items
      .map(item => item.categoryName ?? 'Inne')
      .filter((category, index, array) => array.indexOf(category) === index)
      .sort((a, b) => a.localeCompare(b));

    return ['Wszystko', ...categories];
  }, [items]);
  const filteredItems = useMemo(
    () =>
      selectedCategory === 'Wszystko'
        ? items
        : items.filter(item => (item.categoryName ?? 'Inne') === selectedCategory),
    [items, selectedCategory]
  );

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [loadedItems, loadedOrders] = await Promise.all([
        apiService.getItems(),
        apiService.getOrders(),
      ]);
      setItems(loadedItems);
      setOrders(loadedOrders.filter(order => order.idClient === client.idClient));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Nie udalo sie pobrac danych.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [client.idClient]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addToCart = (item: Item) => {
    setCart(current => {
      const existing = current[item.idItem];
      return {
        ...current,
        [item.idItem]: {
          item,
          quantity: existing ? existing.quantity + 1 : 1,
        },
      };
    });
    setActiveTab('cart');
  };

  const changeQuantity = (itemId: number, delta: number) => {
    setCart(current => {
      const existing = current[itemId];
      if (!existing) {
        return current;
      }

      const nextQuantity = existing.quantity + delta;
      if (nextQuantity <= 0) {
        const copy = { ...current };
        delete copy[itemId];
        return copy;
      }

      return {
        ...current,
        [itemId]: {
          ...existing,
          quantity: nextQuantity,
        },
      };
    });
  };

  const submitOrder = async () => {
    if (cartLines.length === 0) {
      Alert.alert('Koszyk jest pusty', 'Dodaj produkt do koszyka.');
      return;
    }

    if (paymentMethod === 'Karta') {
      const message = validateCardNumber(cardNumber);
      if (message) {
      setPaymentError(message);
      Alert.alert('Dane karty', message);
      return;
      }
    }

    const paymentStatus = paymentMethod === 'Karta' ? 'Oplacone' : 'Platnosc przy odbiorze';
    const paymentLabel = paymentMethod === 'Karta' ? 'Karta' : 'Przy odbiorze';

    try {
      setSaving(true);
      const order = await apiService.createOrder({
        dataOrder: new Date().toISOString(),
        idClient: client.idClient,
        notes: `Zamowienie klienta: ${client.name ?? client.phoneNumber ?? client.idClient}`,
        deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        paymentMethod: paymentLabel,
        paymentStatus,
        totalAmount: cartTotal,
      });

      await Promise.all(
        cartLines.map(line =>
          apiService.createOrderItem({
            idOrder: order.idOrder,
            idItem: line.item.idItem,
            quantity: line.quantity,
            isActive: true,
          })
        )
      );

      setCart({});
      setCardNumber('');
      setPaymentError('');
      await loadData();
      setActiveTab('orders');
      Alert.alert('Zamowienie zlozone', `Status platnosci: ${paymentStatus}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Nie udalo sie zlozyc zamowienia.';
      Alert.alert('Blad zamowienia', message);
    } finally {
      setSaving(false);
    }
  };

  const renderCatalog = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Katalog materialow</Text>
        <Pressable style={styles.smallButton} onPress={loadData}>
          <Text style={styles.smallButtonText}>Odswiez</Text>
        </Pressable>
      </View>

      <View style={styles.catalogIntro}>
        <Text style={styles.catalogIntroTitle}>Wybierz dzial</Text>
        <Text style={styles.catalogIntroText}>Przegladaj produkty wedlug kategorii i dodawaj je do koszyka.</Text>
      </View>

      <Pressable
        style={styles.categoryMenuButton}
        onPress={() => setCategoryMenuOpen(current => !current)}
      >
        <View style={styles.categoryMenuTextBox}>
          <Text style={styles.categoryMenuLabel}>Kategorie</Text>
          <Text style={styles.categoryMenuValue}>{selectedCategory}</Text>
        </View>
        <Text style={styles.categoryMenuIcon}>{categoryMenuOpen ? 'x' : 'menu'}</Text>
      </Pressable>

      {categoryMenuOpen && (
        <View style={styles.categoryMenu}>
          {categoryOptions.map(category => {
            const count =
              category === 'Wszystko'
                ? items.length
                : items.filter(item => (item.categoryName ?? 'Inne') === category).length;
            const isActive = selectedCategory === category;

            return (
              <Pressable
                key={category}
                style={[styles.categoryMenuItem, isActive && styles.categoryMenuItemActive]}
                onPress={() => {
                  setSelectedCategory(category);
                  setCategoryMenuOpen(false);
                }}
              >
                <Text style={[styles.categoryMenuItemText, isActive && styles.categoryMenuItemTextActive]}>
                  {category}
                </Text>
                <Text style={[styles.categoryMenuItemCount, isActive && styles.categoryMenuItemCountActive]}>
                  {count} prod.
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      <View style={styles.catalogSummary}>
        <Text style={styles.catalogSummaryText}>
          {selectedCategory === 'Wszystko' ? 'Wszystkie produkty' : selectedCategory}
        </Text>
        <Text style={styles.catalogSummaryCount}>{filteredItems.length} pozycji</Text>
      </View>

      {filteredItems.length === 0 ? (
        <Text style={styles.empty}>Brak produktow w tej kategorii.</Text>
      ) : filteredItems.map(item => (
        <View key={item.idItem} style={styles.productCard}>
          <View style={styles.productHeader}>
            <Text style={styles.category}>{item.categoryName ?? 'Sklep budowlany'}</Text>
            <Text style={styles.code}>{item.code ?? 'bez kodu'}</Text>
          </View>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.meta}>
            {item.brandName ?? 'Marka wlasna'} - {item.supplierName ?? 'Dostawca'} - {item.warehouseName ?? 'Magazyn'}
          </Text>
          <View style={styles.productFooter}>
            <Text style={styles.price}>{item.price ?? 0} zl</Text>
            <Text style={styles.stock}>Stan: {item.quantity ?? 0} {item.unitName ?? 'szt'}</Text>
          </View>
          <Pressable style={styles.addButton} onPress={() => addToCart(item)}>
            <Text style={styles.addButtonText}>Dodaj do koszyka</Text>
          </Pressable>
        </View>
      ))}
    </View>
  );

  const renderCart = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Koszyk</Text>

      {cartLines.length === 0 ? (
        <Text style={styles.empty}>Koszyk jest pusty.</Text>
      ) : (
        <>
          {cartLines.map(line => (
            <View key={line.item.idItem} style={styles.cartLine}>
              <View style={styles.cartInfo}>
                <Text style={styles.cartName}>{line.item.name}</Text>
                <Text style={styles.cartDetails}>
                  {line.item.price ?? 0} zl x {line.quantity} = {(line.item.price ?? 0) * line.quantity} zl
                </Text>
              </View>
              <View style={styles.quantityControls}>
                <Pressable style={styles.quantityButton} onPress={() => changeQuantity(line.item.idItem, -1)}>
                  <Text style={styles.quantityText}>-</Text>
                </Pressable>
                <Text style={styles.quantityValue}>{line.quantity}</Text>
                <Pressable style={styles.quantityButton} onPress={() => changeQuantity(line.item.idItem, 1)}>
                  <Text style={styles.quantityText}>+</Text>
                </Pressable>
              </View>
            </View>
          ))}

          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Razem do zaplaty</Text>
            <Text style={styles.summaryValue}>{cartTotal} zl</Text>
          </View>

          <Text style={styles.label}>Metoda platnosci</Text>
          <View style={styles.paymentRow}>
            <Pressable
              style={[styles.paymentButton, paymentMethod === 'Odbior' && styles.paymentButtonActive]}
              onPress={() => setPaymentMethod('Odbior')}
            >
              <Text style={[styles.paymentText, paymentMethod === 'Odbior' && styles.paymentTextActive]}>
                Przy odbiorze
              </Text>
            </Pressable>
            <Pressable
              style={[styles.paymentButton, paymentMethod === 'Karta' && styles.paymentButtonActive]}
              onPress={() => setPaymentMethod('Karta')}
            >
              <Text style={[styles.paymentText, paymentMethod === 'Karta' && styles.paymentTextActive]}>
                Karta
              </Text>
            </Pressable>
          </View>

          {paymentMethod === 'Karta' && (
            <>
              <Text style={styles.label}>Numer karty testowej</Text>
              <TextInput
                style={styles.input}
                value={cardNumber}
                keyboardType="numeric"
                placeholder="1111 2222 3333 4444"
                placeholderTextColor="#7b877d"
                onChangeText={text => {
                  setCardNumber(formatCardNumber(text));
                  setPaymentError('');
                }}
                maxLength={19}
              />
              {paymentError ? <Text style={styles.fieldError}>{paymentError}</Text> : null}
            </>
          )}

          <Pressable style={styles.submitButton} onPress={submitOrder} disabled={saving}>
            <Text style={styles.submitButtonText}>
              {saving ? 'Zapisywanie...' : paymentMethod === 'Karta' ? 'Zaplac i zamow' : 'Zamow z platnoscia przy odbiorze'}
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );

  const renderOrders = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Moje zamowienia</Text>
        <Pressable style={styles.smallButton} onPress={loadData}>
          <Text style={styles.smallButtonText}>Odswiez</Text>
        </Pressable>
      </View>

      {orders.length === 0 ? (
        <Text style={styles.empty}>Nie masz jeszcze zamowien.</Text>
      ) : (
        orders.map(order => (
          <View key={order.idOrder} style={styles.orderCard}>
            <Text style={styles.orderTitle}>Zamowienie #{order.idOrder}</Text>
            <Text style={styles.orderText}>Kwota: {order.totalAmount ?? 0} zl</Text>
            <Text style={styles.orderText}>Platnosc: {order.paymentMethod ?? '-'}</Text>
            <Text style={styles.orderStatus}>Status: {order.paymentStatus ?? 'Nowe'}</Text>
            {order.orderItems?.map(line => (
              <Text key={line.idOrderItem} style={styles.orderItem}>
                - {line.item?.name ?? `Produkt #${line.idItem}`} x {line.quantity ?? 0}
              </Text>
            ))}
          </View>
        ))
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ImageBackground source={heroImage} style={styles.hero} imageStyle={styles.heroImage}>
        <View style={styles.heroOverlay}>
          <View style={styles.headerRow}>
            <View style={styles.headerText}>
              <Text style={styles.title}>Witaj, {client.name ?? 'Kliencie'}</Text>
              <Text style={styles.heroText}>MajsterPro Market</Text>
              <Text style={styles.subtitle}>Wybierz materialy, sprawdz koszyk i zloz zamowienie.</Text>
            </View>
            <Pressable style={styles.logoutButton} onPress={onLogout}>
              <Text style={styles.logoutText}>Wyloguj</Text>
            </Pressable>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, activeTab === 'catalog' && styles.tabActive]}
          onPress={() => setActiveTab('catalog')}
        >
          <Text style={[styles.tabText, activeTab === 'catalog' && styles.tabTextActive]}>Katalog</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'cart' && styles.tabActive]}
          onPress={() => setActiveTab('cart')}
        >
          <Text style={[styles.tabText, activeTab === 'cart' && styles.tabTextActive]}>
            Koszyk ({cartLines.length})
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'orders' && styles.tabActive]}
          onPress={() => setActiveTab('orders')}
        >
          <Text style={[styles.tabText, activeTab === 'orders' && styles.tabTextActive]}>Zamowienia</Text>
        </Pressable>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#1f6f43" size="large" />
          <Text style={styles.centerText}>Ladowanie danych...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {activeTab === 'catalog' && renderCatalog()}
          {activeTab === 'cart' && renderCart()}
          {activeTab === 'orders' && renderOrders()}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f1',
  },
  hero: {
    minHeight: 170,
    justifyContent: 'flex-end',
  },
  heroImage: {
    resizeMode: 'cover',
  },
  heroOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(21, 54, 35, 0.72)',
    paddingHorizontal: 16,
    paddingTop: 34,
    paddingBottom: 18,
    borderBottomWidth: 4,
    borderBottomColor: '#f4c430',
  },
  headerRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: '#ffffff',
    fontSize: 21,
    fontWeight: '900',
  },
  heroText: {
    color: '#f4c430',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 4,
  },
  subtitle: {
    color: '#eff7ec',
    marginTop: 4,
    lineHeight: 18,
  },
  logoutButton: {
    backgroundColor: '#f4c430',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  logoutText: {
    color: '#26342b',
    fontWeight: '900',
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    padding: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#dce4d8',
  },
  tab: {
    flex: 1,
    minHeight: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d6dfd2',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fbf7',
  },
  tabActive: {
    backgroundColor: '#1f6f43',
    borderColor: '#1f6f43',
  },
  tabText: {
    color: '#26342b',
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 28,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  sectionTitle: {
    flex: 1,
    color: '#26342b',
    fontSize: 20,
    fontWeight: '900',
  },
  smallButton: {
    backgroundColor: '#f4c430',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  smallButtonText: {
    color: '#26342b',
    fontWeight: '900',
  },
  catalogIntro: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dce4d8',
    padding: 14,
  },
  catalogIntroTitle: {
    color: '#1e2a22',
    fontSize: 16,
    fontWeight: '900',
  },
  catalogIntroText: {
    color: '#566359',
    lineHeight: 19,
    marginTop: 4,
  },
  categoryMenuButton: {
    minHeight: 58,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d6dfd2',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  categoryMenuTextBox: {
    flex: 1,
  },
  categoryMenuLabel: {
    color: '#1f6f43',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  categoryMenuValue: {
    color: '#1e2a22',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 3,
  },
  categoryMenuIcon: {
    minWidth: 48,
    color: '#ffffff',
    backgroundColor: '#1f6f43',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    textAlign: 'center',
    fontWeight: '900',
  },
  categoryMenu: {
    borderWidth: 1,
    borderColor: '#d6dfd2',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  categoryMenuItem: {
    minHeight: 52,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#edf2ea',
  },
  categoryMenuItemActive: {
    backgroundColor: '#1f6f43',
  },
  categoryMenuItemText: {
    color: '#26342b',
    fontWeight: '900',
    fontSize: 14,
  },
  categoryMenuItemTextActive: {
    color: '#ffffff',
  },
  categoryMenuItemCount: {
    color: '#6f7f72',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  categoryMenuItemCountActive: {
    color: '#eff7ec',
  },
  catalogSummary: {
    backgroundColor: '#e8f2e5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  catalogSummaryText: {
    flex: 1,
    color: '#1f6f43',
    fontWeight: '900',
  },
  catalogSummaryCount: {
    color: '#26342b',
    fontWeight: '800',
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#dce4d8',
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
  },
  category: {
    flex: 1,
    color: '#1f6f43',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  code: {
    color: '#6f7f72',
    fontSize: 12,
    fontWeight: '700',
  },
  productName: {
    color: '#1e2a22',
    fontSize: 18,
    fontWeight: '900',
  },
  description: {
    color: '#566359',
    lineHeight: 20,
    marginTop: 6,
  },
  meta: {
    color: '#6f7f72',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    gap: 12,
  },
  price: {
    color: '#c24c26',
    fontSize: 20,
    fontWeight: '900',
  },
  stock: {
    color: '#26342b',
    fontWeight: '700',
  },
  addButton: {
    backgroundColor: '#1f6f43',
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 11,
    marginTop: 14,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '900',
  },
  cartLine: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dce4d8',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cartInfo: {
    flex: 1,
  },
  cartName: {
    color: '#1e2a22',
    fontWeight: '900',
    fontSize: 16,
  },
  cartDetails: {
    color: '#566359',
    marginTop: 5,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityButton: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#1f6f43',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 18,
  },
  quantityValue: {
    minWidth: 20,
    textAlign: 'center',
    fontWeight: '900',
    color: '#26342b',
  },
  summaryBox: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dce4d8',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#26342b',
    fontWeight: '900',
  },
  summaryValue: {
    color: '#c24c26',
    fontSize: 22,
    fontWeight: '900',
  },
  label: {
    color: '#26342b',
    fontWeight: '900',
    marginTop: 6,
  },
  paymentRow: {
    flexDirection: 'row',
    gap: 10,
  },
  paymentButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d6dfd2',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentButtonActive: {
    backgroundColor: '#1f6f43',
    borderColor: '#1f6f43',
  },
  paymentText: {
    color: '#26342b',
    fontWeight: '900',
  },
  paymentTextActive: {
    color: '#ffffff',
  },
  input: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: '#cdd8c8',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#1e2a22',
    backgroundColor: '#ffffff',
  },
  fieldError: {
    color: '#992f1f',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 5,
    lineHeight: 17,
  },
  submitButton: {
    backgroundColor: '#1f6f43',
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 13,
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: '900',
    textAlign: 'center',
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dce4d8',
    padding: 16,
  },
  orderTitle: {
    color: '#1e2a22',
    fontSize: 17,
    fontWeight: '900',
  },
  orderText: {
    color: '#566359',
    marginTop: 6,
  },
  orderStatus: {
    color: '#1f6f43',
    fontWeight: '900',
    marginTop: 6,
  },
  orderItem: {
    color: '#26342b',
    marginTop: 5,
  },
  empty: {
    color: '#566359',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 18,
    textAlign: 'center',
  },
  error: {
    color: '#992f1f',
    backgroundColor: '#fff0ed',
    padding: 12,
    fontWeight: '800',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  centerText: {
    color: '#26342b',
    marginTop: 10,
  },
});

export default CustomerHome;
