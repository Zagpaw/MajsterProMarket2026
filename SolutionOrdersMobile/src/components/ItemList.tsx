import React from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useItems } from '../context/ItemsContext';
import type { Item } from '../types/models';

const ItemList: React.FC = () => {
  const { items, loading, error, refreshItems } = useItems();

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.productCard}>
      <View style={styles.productHeader}>
        <Text style={styles.category}>{item.categoryName ?? 'Sklep budowlany'}</Text>
        <Text style={styles.code}>{item.code ?? 'bez kodu'}</Text>
      </View>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.meta}>
        {item.brandName ?? 'Marka wlasna'} - {item.supplierName ?? 'Dostawca sklepu'} - {item.warehouseName ?? 'Magazyn'}
      </Text>
      <View style={styles.productFooter}>
        <Text style={styles.price}>{item.price ?? 0} zl</Text>
        <Text style={styles.stock}>
          Stan: {item.quantity ?? 0} {item.unitName ?? 'szt'}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#1f6f43" size="large" />
        <Text style={styles.centerText}>Ladowanie katalogu budowlanego...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Nie udalo sie pobrac produktow</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={refreshItems}>
          <Text style={styles.retryButtonText}>Sprobuj ponownie</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.idItem.toString()}
      style={styles.list}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={
        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Katalog produktow</Text>
          <Pressable style={styles.refreshButton} onPress={refreshItems}>
            <Text style={styles.refreshButtonText}>Odswiez</Text>
          </Pressable>
        </View>
      }
      ListEmptyComponent={
        <Text style={styles.emptyText}>Brak produktow w katalogu.</Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: '#f4f6f1',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#26342b',
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
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  code: {
    color: '#6f7f72',
    fontSize: 12,
    fontWeight: '600',
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e2a22',
  },
  description: {
    color: '#566359',
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },
  meta: {
    color: '#6f7f72',
    fontSize: 12,
    marginTop: 8,
    lineHeight: 18,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    gap: 12,
  },
  price: {
    fontSize: 20,
    color: '#c24c26',
    fontWeight: '900',
  },
  stock: {
    color: '#26342b',
    fontWeight: '600',
  },
  refreshButton: {
    backgroundColor: '#f4c430',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  refreshButtonText: {
    color: '#24301f',
    fontWeight: '800',
  },
  center: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f6f1',
  },
  centerText: {
    marginTop: 12,
    color: '#26342b',
    fontSize: 16,
  },
  errorTitle: {
    color: '#992f1f',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  errorText: {
    color: '#566359',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#1f6f43',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '800',
  },
  emptyText: {
    color: '#566359',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});

export default ItemList;
