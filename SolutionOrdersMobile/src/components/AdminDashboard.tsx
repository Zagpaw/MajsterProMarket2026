import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import apiService from '../api/apiService';

type FieldType = 'text' | 'number' | 'boolean' | 'date';

type CrudField = {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
};

type EntityConfig = {
  key: string;
  title: string;
  endpoint: string;
  idKey: string;
  labelKey: string;
  descriptionKey?: string;
  image?: number;
  fields: CrudField[];
};

type RecordData = Record<string, unknown>;
type FormState = Record<string, string>;

const heroImage = require('../assets/images/hero-budomat.jpg');
const shopImage = require('../assets/images/sklep.jpg');
const materialImage = require('../assets/images/materialy.jpg');
const paintImage = require('../assets/images/produkt-farba.jpg');
const panelsImage = require('../assets/images/produkt-panele.jpg');

const entityConfigs: EntityConfig[] = [
  {
    key: 'items',
    title: 'Produkty',
    endpoint: '/Item',
    idKey: 'idItem',
    labelKey: 'name',
    descriptionKey: 'description',
    image: materialImage,
    fields: [
      { key: 'name', label: 'Nazwa', type: 'text', required: true },
      { key: 'description', label: 'Opis', type: 'text' },
      { key: 'idCategory', label: 'ID kategorii', type: 'number', required: true },
      { key: 'price', label: 'Cena', type: 'number' },
      { key: 'quantity', label: 'Ilosc', type: 'number' },
      { key: 'idUnitOfMeasurement', label: 'ID jednostki', type: 'number' },
      { key: 'idSupplier', label: 'ID dostawcy', type: 'number' },
      { key: 'idBrand', label: 'ID marki', type: 'number' },
      { key: 'idWarehouse', label: 'ID magazynu', type: 'number' },
      { key: 'code', label: 'Kod', type: 'text' },
      { key: 'isActive', label: 'Aktywny', type: 'boolean' },
    ],
  },
  {
    key: 'categories',
    title: 'Kategorie',
    endpoint: '/Category',
    idKey: 'idCategory',
    labelKey: 'name',
    descriptionKey: 'description',
    image: shopImage,
    fields: [
      { key: 'name', label: 'Nazwa', type: 'text', required: true },
      { key: 'description', label: 'Opis', type: 'text' },
      { key: 'isActive', label: 'Aktywna', type: 'boolean' },
    ],
  },
  {
    key: 'units',
    title: 'Jednostki',
    endpoint: '/UnitOfMeasurement',
    idKey: 'idUnitOfMeasurement',
    labelKey: 'name',
    descriptionKey: 'description',
    fields: [
      { key: 'name', label: 'Nazwa', type: 'text', required: true },
      { key: 'description', label: 'Opis', type: 'text' },
      { key: 'isActive', label: 'Aktywna', type: 'boolean' },
    ],
  },
  {
    key: 'clients',
    title: 'Klienci',
    endpoint: '/Client',
    idKey: 'idClient',
    labelKey: 'name',
    descriptionKey: 'address',
    image: panelsImage,
    fields: [
      { key: 'name', label: 'Nazwa', type: 'text', required: true },
      { key: 'address', label: 'Adres', type: 'text' },
      { key: 'phoneNumber', label: 'Telefon', type: 'text' },
      { key: 'isActive', label: 'Aktywny', type: 'boolean' },
    ],
  },
  {
    key: 'workers',
    title: 'Pracownicy',
    endpoint: '/Worker',
    idKey: 'idWorker',
    labelKey: 'login',
    descriptionKey: 'lastName',
    fields: [
      { key: 'firstName', label: 'Imie', type: 'text' },
      { key: 'lastName', label: 'Nazwisko', type: 'text' },
      { key: 'login', label: 'Login', type: 'text', required: true },
      { key: 'isActive', label: 'Aktywny', type: 'boolean' },
    ],
  },
  {
    key: 'suppliers',
    title: 'Dostawcy',
    endpoint: '/Supplier',
    idKey: 'idSupplier',
    labelKey: 'name',
    descriptionKey: 'contactEmail',
    image: shopImage,
    fields: [
      { key: 'name', label: 'Nazwa', type: 'text', required: true },
      { key: 'contactEmail', label: 'Email', type: 'text' },
      { key: 'phoneNumber', label: 'Telefon', type: 'text' },
      { key: 'isActive', label: 'Aktywny', type: 'boolean' },
    ],
  },
  {
    key: 'brands',
    title: 'Marki',
    endpoint: '/Brand',
    idKey: 'idBrand',
    labelKey: 'name',
    descriptionKey: 'description',
    image: paintImage,
    fields: [
      { key: 'name', label: 'Nazwa', type: 'text', required: true },
      { key: 'description', label: 'Opis', type: 'text' },
      { key: 'isActive', label: 'Aktywna', type: 'boolean' },
    ],
  },
  {
    key: 'warehouses',
    title: 'Magazyny',
    endpoint: '/Warehouse',
    idKey: 'idWarehouse',
    labelKey: 'name',
    descriptionKey: 'location',
    image: shopImage,
    fields: [
      { key: 'name', label: 'Nazwa', type: 'text', required: true },
      { key: 'location', label: 'Lokalizacja', type: 'text' },
      { key: 'isActive', label: 'Aktywny', type: 'boolean' },
    ],
  },
  {
    key: 'orders',
    title: 'Zamowienia',
    endpoint: '/Order',
    idKey: 'idOrder',
    labelKey: 'notes',
    descriptionKey: 'deliveryDate',
    fields: [
      { key: 'dataOrder', label: 'Data zamowienia', type: 'date' },
      { key: 'idClient', label: 'ID klienta', type: 'number' },
      { key: 'idWorker', label: 'ID pracownika', type: 'number' },
      { key: 'notes', label: 'Notatki', type: 'text' },
      { key: 'deliveryDate', label: 'Data dostawy', type: 'date' },
    ],
  },
  {
    key: 'orderItems',
    title: 'Pozycje zamowien',
    endpoint: '/OrderItem',
    idKey: 'idOrderItem',
    labelKey: 'idItem',
    descriptionKey: 'quantity',
    fields: [
      { key: 'idOrder', label: 'ID zamowienia', type: 'number', required: true },
      { key: 'idItem', label: 'ID produktu', type: 'number', required: true },
      { key: 'quantity', label: 'Ilosc', type: 'number' },
      { key: 'isActive', label: 'Aktywna', type: 'boolean' },
    ],
  },
];

const createInitialForm = (config: EntityConfig, record?: RecordData): FormState => {
  const form: FormState = {};

  config.fields.forEach(field => {
    const value = record?.[field.key];

    if (value === undefined || value === null) {
      form[field.key] = field.type === 'boolean' ? 'true' : '';
      return;
    }

    form[field.key] = String(value);
  });

  return form;
};

const convertValue = (field: CrudField, value: string): unknown => {
  if (field.type === 'boolean') {
    return value === 'true';
  }

  if (value.trim() === '') {
    return null;
  }

  if (field.type === 'number') {
    return Number(value.replace(',', '.'));
  }

  return value;
};

const buildPayload = (
  config: EntityConfig,
  form: FormState,
  selectedRecord?: RecordData
): RecordData => {
  const payload: RecordData = {};

  if (selectedRecord) {
    payload[config.idKey] = selectedRecord[config.idKey];
  }

  config.fields.forEach(field => {
    payload[field.key] = convertValue(field, form[field.key] ?? '');
  });

  return payload;
};

const getRecordTitle = (config: EntityConfig, record: RecordData): string => {
  const value = record[config.labelKey];
  if (value !== undefined && value !== null && String(value).trim() !== '') {
    return String(value);
  }

  return `${config.title} #${String(record[config.idKey] ?? '')}`;
};

const getRecordDescription = (config: EntityConfig, record: RecordData): string => {
  if (!config.descriptionKey) {
    return `ID: ${String(record[config.idKey] ?? '-')}`;
  }

  const value = record[config.descriptionKey];
  return value !== undefined && value !== null && String(value).trim() !== ''
    ? String(value)
    : `ID: ${String(record[config.idKey] ?? '-')}`;
};

function AdminDashboard(): React.JSX.Element {
  const [activeKey, setActiveKey] = useState(entityConfigs[0].key);
  const [records, setRecords] = useState<RecordData[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<RecordData | undefined>();
  const [form, setForm] = useState<FormState>(() => createInitialForm(entityConfigs[0]));
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeConfig = useMemo(
    () => entityConfigs.find(config => config.key === activeKey) ?? entityConfigs[0],
    [activeKey]
  );

  const loadRecords = useCallback(async (config = activeConfig) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getEntityList<RecordData>(config.endpoint);
      setRecords(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Nieznany blad API';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [activeConfig]);

  useEffect(() => {
    setSelectedRecord(undefined);
    setForm(createInitialForm(activeConfig));
    loadRecords(activeConfig);
  }, [activeConfig, loadRecords]);

  const selectRecord = (record: RecordData) => {
    setSelectedRecord(record);
    setForm(createInitialForm(activeConfig, record));
  };

  const resetForm = () => {
    setSelectedRecord(undefined);
    setForm(createInitialForm(activeConfig));
  };

  const saveRecord = async () => {
    const missingField = activeConfig.fields.find(
      field => field.required && !String(form[field.key] ?? '').trim()
    );

    if (missingField) {
      Alert.alert('Brak danych', `Uzupelnij pole: ${missingField.label}`);
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const payload = buildPayload(activeConfig, form, selectedRecord);

      if (selectedRecord) {
        await apiService.updateEntity(
          activeConfig.endpoint,
          Number(selectedRecord[activeConfig.idKey]),
          payload
        );
      } else {
        await apiService.createEntity(activeConfig.endpoint, payload);
      }

      await loadRecords();
      resetForm();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Nie udalo sie zapisac danych';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const deleteRecord = async (record: RecordData) => {
    try {
      setSaving(true);
      setError(null);
      await apiService.deleteEntity(activeConfig.endpoint, Number(record[activeConfig.idKey]));
      await loadRecords();
      resetForm();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Nie udalo sie usunac rekordu';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const renderRecord = ({ item }: { item: RecordData }) => {
    const isSelected = selectedRecord?.[activeConfig.idKey] === item[activeConfig.idKey];
    const image = activeConfig.image ?? materialImage;

    return (
      <Pressable
        style={[styles.recordCard, isSelected && styles.recordCardSelected]}
        onPress={() => selectRecord(item)}
      >
        <Image source={image} style={styles.recordImage} />
        <View style={styles.recordContent}>
          <Text style={styles.recordTitle}>{getRecordTitle(activeConfig, item)}</Text>
          <Text style={styles.recordDescription}>{getRecordDescription(activeConfig, item)}</Text>
          <Text style={styles.recordId}>ID: {String(item[activeConfig.idKey] ?? '-')}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={heroImage} style={styles.hero} imageStyle={styles.heroImage}>
        <View style={styles.heroOverlay}>
          <Text style={styles.brand}>MajsterPro Market</Text>
          <Text style={styles.heroText}>Panel sklepu budowlano-remontowego</Text>
          <Text style={styles.heroSubtext}>CRUD dla 10 tabel, relacje i seeder gotowe do prezentacji.</Text>
        </View>
      </ImageBackground>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabs}
        contentContainerStyle={styles.tabsContent}
      >
        {entityConfigs.map(config => (
          <Pressable
            key={config.key}
            style={[styles.tab, config.key === activeKey && styles.tabActive]}
            onPress={() => setActiveKey(config.key)}
          >
            <Text style={[styles.tabText, config.key === activeKey && styles.tabTextActive]}>
              {config.title}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.content}>
        <View style={styles.formPanel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>
              {selectedRecord ? `Edycja: ${activeConfig.title}` : `Nowy rekord: ${activeConfig.title}`}
            </Text>
            <Pressable style={styles.secondaryButton} onPress={resetForm}>
              <Text style={styles.secondaryButtonText}>Wyczysc</Text>
            </Pressable>
          </View>

          {activeConfig.fields.map(field => {
            const value = form[field.key] ?? '';

            if (field.type === 'boolean') {
              return (
                <Pressable
                  key={field.key}
                  style={styles.booleanInput}
                  onPress={() =>
                    setForm(current => ({
                      ...current,
                      [field.key]: current[field.key] === 'true' ? 'false' : 'true',
                    }))
                  }
                >
                  <Text style={styles.inputLabel}>{field.label}</Text>
                  <Text style={styles.booleanValue}>{value === 'true' ? 'Tak' : 'Nie'}</Text>
                </Pressable>
              );
            }

            return (
              <View key={field.key} style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{field.label}</Text>
                <TextInput
                  style={styles.input}
                  value={value}
                  keyboardType={field.type === 'number' ? 'numeric' : 'default'}
                  placeholder={field.type === 'date' ? '2026-04-18T10:00:00' : field.label}
                  placeholderTextColor="#7b877d"
                  onChangeText={text =>
                    setForm(current => ({
                      ...current,
                      [field.key]: text,
                    }))
                  }
                />
              </View>
            );
          })}

          <View style={styles.actions}>
            <Pressable style={styles.primaryButton} onPress={saveRecord} disabled={saving}>
              <Text style={styles.primaryButtonText}>{saving ? 'Zapisywanie...' : 'Zapisz'}</Text>
            </Pressable>
            {selectedRecord && (
              <Pressable
                style={styles.deleteButton}
                onPress={() => deleteRecord(selectedRecord)}
                disabled={saving}
              >
                <Text style={styles.deleteButtonText}>Usun</Text>
              </Pressable>
            )}
          </View>
        </View>

        <View style={styles.listPanel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>{activeConfig.title}</Text>
            <Pressable style={styles.secondaryButton} onPress={() => loadRecords()}>
              <Text style={styles.secondaryButtonText}>Odswiez</Text>
            </Pressable>
          </View>

          {error && <Text style={styles.error}>{error}</Text>}

          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator color="#1f6f43" />
              <Text style={styles.loadingText}>Ladowanie danych...</Text>
            </View>
          ) : (
            <FlatList
              data={records}
              renderItem={renderRecord}
              keyExtractor={(item, index) => String(item[activeConfig.idKey] ?? index)}
              contentContainerStyle={styles.recordsList}
              ListEmptyComponent={<Text style={styles.empty}>Brak rekordow.</Text>}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f1',
  },
  hero: {
    minHeight: 190,
    justifyContent: 'flex-end',
  },
  heroImage: {
    resizeMode: 'cover',
  },
  heroOverlay: {
    backgroundColor: 'rgba(21, 54, 35, 0.76)',
    paddingHorizontal: 20,
    paddingTop: 34,
    paddingBottom: 20,
  },
  brand: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '900',
  },
  heroText: {
    color: '#f4c430',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 6,
  },
  heroSubtext: {
    color: '#eff7ec',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  tabs: {
    maxHeight: 64,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#dce4d8',
  },
  tabsContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  tab: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cdd8c8',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
  },
  tabActive: {
    backgroundColor: '#1f6f43',
    borderColor: '#1f6f43',
  },
  tabText: {
    color: '#26342b',
    fontWeight: '800',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 14,
    gap: 14,
  },
  formPanel: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dce4d8',
    padding: 14,
  },
  listPanel: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dce4d8',
    padding: 14,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  panelTitle: {
    flex: 1,
    color: '#1e2a22',
    fontSize: 18,
    fontWeight: '900',
  },
  inputGroup: {
    marginBottom: 10,
  },
  inputLabel: {
    color: '#26342b',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 5,
  },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: '#cdd8c8',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#1e2a22',
    backgroundColor: '#f9fbf7',
  },
  booleanInput: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#cdd8c8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    backgroundColor: '#f9fbf7',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  booleanValue: {
    color: '#1f6f43',
    fontWeight: '900',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#1f6f43',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '900',
  },
  secondaryButton: {
    backgroundColor: '#f4c430',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  secondaryButtonText: {
    color: '#26342b',
    fontWeight: '900',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#992f1f',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#ffffff',
    fontWeight: '900',
  },
  error: {
    color: '#992f1f',
    fontWeight: '700',
    marginBottom: 10,
  },
  loadingBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 26,
  },
  loadingText: {
    color: '#26342b',
    marginTop: 10,
  },
  recordsList: {
    gap: 10,
    paddingBottom: 20,
  },
  recordCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#dce4d8',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#ffffff',
    gap: 12,
  },
  recordCardSelected: {
    borderColor: '#1f6f43',
    backgroundColor: '#f0f8ec',
  },
  recordImage: {
    width: 74,
    height: 74,
    borderRadius: 8,
    backgroundColor: '#dce4d8',
  },
  recordContent: {
    flex: 1,
    justifyContent: 'center',
  },
  recordTitle: {
    color: '#1e2a22',
    fontSize: 16,
    fontWeight: '900',
  },
  recordDescription: {
    color: '#566359',
    marginTop: 4,
    lineHeight: 18,
  },
  recordId: {
    color: '#1f6f43',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 5,
  },
  empty: {
    color: '#566359',
    textAlign: 'center',
    padding: 26,
  },
});

export default AdminDashboard;
