import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
  lookupEndpoint?: string;
  lookupIdKey?: string;
  lookupLabelKey?: string;
  lookupDescriptionKey?: string;
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
type FormErrors = Record<string, string>;
type LookupOption = {
  id: string;
  label: string;
  description?: string;
};

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
      {
        key: 'idCategory',
        label: 'Kategoria',
        type: 'number',
        required: true,
        lookupEndpoint: '/Category',
        lookupIdKey: 'idCategory',
        lookupLabelKey: 'name',
        lookupDescriptionKey: 'description',
      },
      { key: 'price', label: 'Cena', type: 'number' },
      { key: 'quantity', label: 'Ilosc', type: 'number' },
      {
        key: 'idUnitOfMeasurement',
        label: 'Jednostka',
        type: 'number',
        required: true,
        lookupEndpoint: '/UnitOfMeasurement',
        lookupIdKey: 'idUnitOfMeasurement',
        lookupLabelKey: 'name',
        lookupDescriptionKey: 'description',
      },
      {
        key: 'idSupplier',
        label: 'Dostawca',
        type: 'number',
        required: true,
        lookupEndpoint: '/Supplier',
        lookupIdKey: 'idSupplier',
        lookupLabelKey: 'name',
        lookupDescriptionKey: 'contactEmail',
      },
      {
        key: 'idBrand',
        label: 'Marka',
        type: 'number',
        required: true,
        lookupEndpoint: '/Brand',
        lookupIdKey: 'idBrand',
        lookupLabelKey: 'name',
        lookupDescriptionKey: 'description',
      },
      {
        key: 'idWarehouse',
        label: 'Magazyn',
        type: 'number',
        required: true,
        lookupEndpoint: '/Warehouse',
        lookupIdKey: 'idWarehouse',
        lookupLabelKey: 'name',
        lookupDescriptionKey: 'location',
      },
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
      { key: 'password', label: 'Haslo', type: 'text' },
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
      { key: 'password', label: 'Haslo', type: 'text', required: true },
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
      {
        key: 'idClient',
        label: 'Klient',
        type: 'number',
        lookupEndpoint: '/Client',
        lookupIdKey: 'idClient',
        lookupLabelKey: 'name',
        lookupDescriptionKey: 'phoneNumber',
      },
      {
        key: 'idWorker',
        label: 'Pracownik',
        type: 'number',
        lookupEndpoint: '/Worker',
        lookupIdKey: 'idWorker',
        lookupLabelKey: 'login',
        lookupDescriptionKey: 'lastName',
      },
      { key: 'notes', label: 'Notatki', type: 'text' },
      { key: 'deliveryDate', label: 'Data dostawy', type: 'date' },
      { key: 'paymentMethod', label: 'Metoda platnosci', type: 'text' },
      { key: 'paymentStatus', label: 'Status platnosci', type: 'text' },
      { key: 'totalAmount', label: 'Kwota razem', type: 'number' },
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
      {
        key: 'idOrder',
        label: 'Zamowienie',
        type: 'number',
        required: true,
        lookupEndpoint: '/Order',
        lookupIdKey: 'idOrder',
        lookupLabelKey: 'notes',
        lookupDescriptionKey: 'paymentStatus',
      },
      {
        key: 'idItem',
        label: 'Produkt',
        type: 'number',
        required: true,
        lookupEndpoint: '/Item',
        lookupIdKey: 'idItem',
        lookupLabelKey: 'name',
        lookupDescriptionKey: 'code',
      },
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

const validateForm = (config: EntityConfig, form: FormState): FormErrors => {
  const errors: FormErrors = {};

  config.fields.forEach(field => {
    const value = String(form[field.key] ?? '').trim();

    if (field.required && !value) {
      errors[field.key] = field.lookupEndpoint
        ? `Pole ${field.label} nie jest wybrane. Wybierz wartość z listy.`
        : `Pole ${field.label} nie jest wypełnione. Uzupełnij to pole.`;
      return;
    }

    if (field.type === 'number' && value && Number.isNaN(Number(value.replace(',', '.')))) {
      errors[field.key] = `Pole ${field.label} musi być poprawną liczbą.`;
      return;
    }

    if (field.type === 'date' && value && Number.isNaN(Date.parse(value))) {
      errors[field.key] = `Pole ${field.label} musi mieć poprawną datę.`;
    }
  });

  return errors;
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

const getLookupFields = (config: EntityConfig): CrudField[] =>
  config.fields.filter(field => field.lookupEndpoint);

const mapLookupOptions = (field: CrudField, data: RecordData[]): LookupOption[] => {
  const idKey = field.lookupIdKey ?? field.key;
  const labelKey = field.lookupLabelKey ?? 'name';
  const descriptionKey = field.lookupDescriptionKey;

  return data.map(item => {
    const id = String(item[idKey] ?? '');
    const labelValue = item[labelKey];
    const descriptionValue = descriptionKey ? item[descriptionKey] : undefined;

    return {
      id,
      label:
        labelValue !== undefined && labelValue !== null && String(labelValue).trim() !== ''
          ? String(labelValue)
          : `${field.label} #${id}`,
      description:
        descriptionValue !== undefined && descriptionValue !== null
          ? String(descriptionValue)
          : undefined,
    };
  });
};

function AdminDashboard(): React.JSX.Element {
  const [activeKey, setActiveKey] = useState(entityConfigs[0].key);
  const [records, setRecords] = useState<RecordData[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<RecordData | undefined>();
  const [form, setForm] = useState<FormState>(() => createInitialForm(entityConfigs[0]));
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [lookups, setLookups] = useState<Record<string, LookupOption[]>>({});
  const [openLookupKey, setOpenLookupKey] = useState<string | null>(null);

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

  const loadLookups = useCallback(async (config: EntityConfig) => {
    const lookupFields = getLookupFields(config);

    if (lookupFields.length === 0) {
      setLookups({});
      return;
    }

    try {
      const results = await Promise.all(
        lookupFields.map(async field => {
          const data = await apiService.getEntityList<RecordData>(field.lookupEndpoint ?? '');
          return [field.key, mapLookupOptions(field, data)] as const;
        })
      );

      setLookups(Object.fromEntries(results));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Nie udalo sie pobrac list wyboru';
      setError(message);
    }
  }, []);

  useEffect(() => {
    setSelectedRecord(undefined);
    setForm(createInitialForm(activeConfig));
    setFormErrors({});
    setOpenLookupKey(null);
    loadRecords(activeConfig);
    loadLookups(activeConfig);
  }, [activeConfig, loadRecords, loadLookups]);

  const selectRecord = (record: RecordData) => {
    setSelectedRecord(record);
    setForm(createInitialForm(activeConfig, record));
    setFormErrors({});
  };

  const resetForm = () => {
    setSelectedRecord(undefined);
    setForm(createInitialForm(activeConfig));
    setFormErrors({});
    setOpenLookupKey(null);
  };

  const saveRecord = async () => {
    const validationErrors = validateForm(activeConfig, form);
    setFormErrors(validationErrors);

    const firstError = Object.values(validationErrors)[0];
    if (firstError) {
      Alert.alert('Brak danych', firstError);
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

  const renderLookupField = (field: CrudField, value: string) => {
    const options = lookups[field.key] ?? [];
    const selectedOption = options.find(option => option.id === value);
    const isOpen = openLookupKey === field.key;

    return (
      <View key={field.key} style={styles.inputGroup}>
        <Text style={styles.inputLabel}>{field.label}</Text>
        <Pressable
          style={[styles.selectInput, formErrors[field.key] && styles.inputInvalid]}
          onPress={() => setOpenLookupKey(current => (current === field.key ? null : field.key))}
        >
          <View style={styles.selectTextBox}>
            <Text style={[styles.selectText, !selectedOption && styles.selectPlaceholder]}>
              {selectedOption ? selectedOption.label : `Wybierz: ${field.label}`}
            </Text>
            {selectedOption?.description ? (
              <Text style={styles.selectDescription}>{selectedOption.description}</Text>
            ) : null}
          </View>
          <Text style={styles.selectArrow}>{isOpen ? '^' : 'v'}</Text>
        </Pressable>

        {isOpen && (
          <View style={styles.selectMenu}>
            {!field.required && (
              <Pressable
                style={styles.selectOption}
                onPress={() => {
                  setForm(current => ({ ...current, [field.key]: '' }));
                  setFormErrors(current => ({ ...current, [field.key]: '' }));
                  setOpenLookupKey(null);
                }}
              >
                <Text style={styles.selectOptionText}>Brak</Text>
              </Pressable>
            )}

            {options.length === 0 ? (
              <Text style={styles.selectEmpty}>Brak danych do wyboru.</Text>
            ) : (
              options.map(option => (
                <Pressable
                  key={`${field.key}-${option.id}`}
                  style={[
                    styles.selectOption,
                    option.id === value && styles.selectOptionActive,
                  ]}
                  onPress={() => {
                    setForm(current => ({ ...current, [field.key]: option.id }));
                    setFormErrors(current => ({ ...current, [field.key]: '' }));
                    setOpenLookupKey(null);
                  }}
                >
                  <Text style={styles.selectOptionText}>
                    {option.label}
                  </Text>
                  {option.description ? (
                    <Text style={styles.selectOptionDescription}>{option.description}</Text>
                  ) : null}
                  <Text style={styles.selectOptionId}>ID: {option.id}</Text>
                </Pressable>
              ))
            )}
          </View>
        )}

        {formErrors[field.key] ? (
          <Text style={styles.fieldError}>{formErrors[field.key]}</Text>
        ) : null}
      </View>
    );
  };

  const renderRecord = (item: RecordData, index: number) => {
    const isSelected = selectedRecord?.[activeConfig.idKey] === item[activeConfig.idKey];
    const image = activeConfig.image ?? materialImage;

    return (
      <Pressable
        key={String(item[activeConfig.idKey] ?? index)}
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
    <ScrollView style={styles.container} contentContainerStyle={styles.pageContent}>
      <ImageBackground source={heroImage} style={styles.hero} imageStyle={styles.heroImage}>
        <View style={styles.heroOverlay}>
          <Text style={styles.brand}>MajsterPro Market</Text>
          <Text style={styles.heroText}>Sklep budowlano-remontowy</Text>
          <Text style={styles.heroSubtext}>Zarzadzaj produktami, zamowieniami, dostawami i magazynem.</Text>
        </View>
      </ImageBackground>

      <View style={styles.tabs}>
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
      </View>

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

            if (field.lookupEndpoint) {
              return renderLookupField(field, value);
            }

            return (
              <View key={field.key} style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{field.label}</Text>
                <TextInput
                  style={[styles.input, formErrors[field.key] && styles.inputInvalid]}
                  value={value}
                  keyboardType={field.type === 'number' ? 'numeric' : 'default'}
                  placeholder={field.type === 'date' ? '2026-04-18T10:00:00' : field.label}
                  placeholderTextColor="#7b877d"
                  onChangeText={text => {
                    setForm(current => ({
                      ...current,
                      [field.key]: text,
                    }));
                    setFormErrors(current => ({ ...current, [field.key]: '' }));
                  }}
                />
                {formErrors[field.key] ? (
                  <Text style={styles.fieldError}>{formErrors[field.key]}</Text>
                ) : null}
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
          ) : records.length === 0 ? (
            <Text style={styles.empty}>Brak rekordow.</Text>
          ) : (
            <View style={styles.recordsList}>
              {records.map(renderRecord)}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f1',
  },
  pageContent: {
    paddingBottom: 28,
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
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#dce4d8',
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tab: {
    width: '47%',
    minHeight: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d6dfd2',
    paddingHorizontal: 12,
    paddingVertical: 11,
    backgroundColor: '#f9fbf7',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  tabActive: {
    backgroundColor: '#1f6f43',
    borderColor: '#1f6f43',
    elevation: 4,
  },
  tabText: {
    color: '#26342b',
    fontWeight: '800',
    fontSize: 13,
    textAlign: 'center',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  content: {
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
  inputInvalid: {
    borderColor: '#992f1f',
    backgroundColor: '#fff8f6',
  },
  fieldError: {
    color: '#992f1f',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 5,
    lineHeight: 17,
  },
  selectInput: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#cdd8c8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: '#f9fbf7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  selectTextBox: {
    flex: 1,
  },
  selectText: {
    color: '#1e2a22',
    fontSize: 14,
    fontWeight: '800',
  },
  selectPlaceholder: {
    color: '#7b877d',
    fontWeight: '600',
  },
  selectDescription: {
    color: '#566359',
    fontSize: 12,
    marginTop: 3,
  },
  selectArrow: {
    color: '#1f6f43',
    fontSize: 18,
    fontWeight: '900',
  },
  selectMenu: {
    borderWidth: 1,
    borderColor: '#cdd8c8',
    borderRadius: 8,
    marginTop: 6,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  selectOption: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#edf2ea',
  },
  selectOptionActive: {
    backgroundColor: '#f0f8ec',
  },
  selectOptionText: {
    color: '#1e2a22',
    fontWeight: '800',
  },
  selectOptionDescription: {
    color: '#566359',
    fontSize: 12,
    marginTop: 2,
  },
  selectOptionId: {
    color: '#1f6f43',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 3,
  },
  selectEmpty: {
    color: '#566359',
    padding: 12,
    textAlign: 'center',
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
