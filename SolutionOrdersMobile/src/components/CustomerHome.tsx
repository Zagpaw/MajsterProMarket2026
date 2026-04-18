import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ItemsProvider } from '../context/ItemsContext';
import type { Client } from '../types/models';
import ItemList from './ItemList';

type CustomerHomeProps = {
  client: Client;
  onLogout: () => void;
};

function CustomerHome({ client, onLogout }: CustomerHomeProps): React.JSX.Element {
  return (
    <ItemsProvider>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Witaj, {client.name ?? 'Kliencie'}</Text>
            <Text style={styles.subtitle}>Przegladaj katalog MajsterPro Market.</Text>
          </View>
          <Pressable style={styles.logoutButton} onPress={onLogout}>
            <Text style={styles.logoutText}>Wyloguj</Text>
          </Pressable>
        </View>
        <ItemList />
      </View>
    </ItemsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f1',
  },
  header: {
    backgroundColor: '#1f6f43',
    padding: 16,
    borderBottomWidth: 4,
    borderBottomColor: '#f4c430',
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
});

export default CustomerHome;
