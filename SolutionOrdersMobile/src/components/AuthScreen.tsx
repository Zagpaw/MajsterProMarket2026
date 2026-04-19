import React, { useState } from 'react';
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
import type { Client, Worker } from '../types/models';

export type Session =
  | { role: 'admin'; name: string }
  | { role: 'client'; name: string; client: Client };

type AuthScreenProps = {
  onLogin: (session: Session) => void;
};

type AuthErrors = Record<string, string>;

const heroImage = require('../assets/images/hero-budomat.jpg');

function AuthScreen({ onLogin }: AuthScreenProps): React.JSX.Element {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [login, setLogin] = useState('pawel');
  const [password, setPassword] = useState('haslo.123');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<AuthErrors>({});

  const setField = (key: string, value: string, setter: (text: string) => void) => {
    setter(value);
    setErrors(current => ({ ...current, [key]: '' }));
  };

  const validateLogin = (): AuthErrors => {
    const nextErrors: AuthErrors = {};

    if (!login.trim()) {
      nextErrors.login = 'Pole Login albo numer telefonu nie jest wypełnione.';
    }

    if (!password.trim()) {
      nextErrors.password = 'Pole Hasło nie jest wypełnione.';
    }

    return nextErrors;
  };

  const validateRegister = (): AuthErrors => {
    const nextErrors: AuthErrors = {};

    if (!name.trim()) {
      nextErrors.name = 'Pole Login klienta albo nazwa firmy nie jest wypełnione.';
    }

    if (!phoneNumber.trim()) {
      nextErrors.phoneNumber = 'Pole Telefon nie jest wypełnione.';
    }

    if (!password.trim()) {
      nextErrors.password = 'Pole Hasło nie jest wypełnione.';
    }

    return nextErrors;
  };

  const signIn = async () => {
    const validationErrors = validateLogin();
    setErrors(validationErrors);

    const firstError = Object.values(validationErrors)[0];
    if (firstError) {
      Alert.alert('Brak danych', firstError);
      return;
    }

    try {
      setLoading(true);
      const workers = await apiService.getWorkers();
      const admin = workers.find(
        (worker: Worker) =>
          worker.isActive &&
          worker.login?.toLowerCase() === login.trim().toLowerCase() &&
          worker.password === password
      );

      if (admin) {
        onLogin({ role: 'admin', name: admin.firstName ?? admin.login });
        return;
      }

      const clients = await apiService.getClients();
      const normalizedLogin = login.trim().toLowerCase();
      const client = clients.find(
        (item: Client) =>
          item.isActive &&
          (item.phoneNumber === login.trim() ||
            item.name?.trim().toLowerCase() === normalizedLogin) &&
          item.password === password
      );

      if (client) {
        onLogin({ role: 'client', name: client.name ?? 'Klient', client });
        return;
      }

      Alert.alert('Niepoprawne logowanie', 'Sprawdz login/telefon oraz haslo.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nie udalo sie zalogowac.';
      Alert.alert('Blad logowania', message);
    } finally {
      setLoading(false);
    }
  };

  const register = async () => {
    const validationErrors = validateRegister();
    setErrors(validationErrors);

    const firstError = Object.values(validationErrors)[0];
    if (firstError) {
      Alert.alert('Brak danych', firstError);
      return;
    }

    try {
      setLoading(true);
      await apiService.createClient({
        name,
        address,
        phoneNumber,
        password,
        isActive: true,
      });

      Alert.alert('Konto klienta utworzone', 'Mozesz teraz przejsc do logowania.');
      setLogin(phoneNumber);
      setPassword('');
      setName('');
      setAddress('');
      setPhoneNumber('');
      setErrors({});
      setMode('login');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nie udalo sie utworzyc konta.';
      Alert.alert('Blad rejestracji', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ImageBackground source={heroImage} style={styles.hero} imageStyle={styles.heroImage}>
        <View style={styles.heroOverlay}>
          <Text style={styles.brand}>MajsterPro Market</Text>
          <Text style={styles.heroText}>Logowanie do sklepu</Text>
          <Text style={styles.heroSubtext}>Admin zarzadza sklepem, klient przeglada katalog.</Text>
        </View>
      </ImageBackground>

      <View style={styles.modeRow}>
        <Pressable
          style={[styles.modeButton, mode === 'login' && styles.modeButtonActive]}
          onPress={() => setMode('login')}
        >
          <Text style={[styles.modeText, mode === 'login' && styles.modeTextActive]}>
            Logowanie
          </Text>
        </Pressable>
        <Pressable
          style={[styles.modeButton, mode === 'register' && styles.modeButtonActive]}
          onPress={() => setMode('register')}
        >
          <Text style={[styles.modeText, mode === 'register' && styles.modeTextActive]}>
            Rejestracja
          </Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        {mode === 'login' ? (
          <>
            <Text style={styles.title}>Zaloguj sie</Text>

            <Text style={styles.label}>Login albo numer telefonu</Text>
            <TextInput
              style={[styles.input, errors.login && styles.inputInvalid]}
              value={login}
              autoCapitalize="none"
              placeholder="Login lub telefon"
              placeholderTextColor="#7b877d"
              onChangeText={text => setField('login', text, setLogin)}
            />
            {errors.login ? <Text style={styles.fieldError}>{errors.login}</Text> : null}

            <Text style={styles.label}>Haslo</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputInvalid]}
              value={password}
              secureTextEntry
              placeholder="Haslo"
              placeholderTextColor="#7b877d"
              onChangeText={text => setField('password', text, setPassword)}
            />
            {errors.password ? <Text style={styles.fieldError}>{errors.password}</Text> : null}

            <Pressable style={styles.primaryButton} onPress={signIn} disabled={loading}>
              {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.primaryText}>Zaloguj</Text>}
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.title}>Utworz konto klienta</Text>

            <Text style={styles.label}>Login klienta albo nazwa firmy</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputInvalid]}
              value={name}
              autoCapitalize="none"
              placeholder="anna albo Firma Budowlana"
              placeholderTextColor="#7b877d"
              onChangeText={text => setField('name', text, setName)}
            />
            {errors.name ? <Text style={styles.fieldError}>{errors.name}</Text> : null}

            <Text style={styles.label}>Adres</Text>
            <TextInput
              style={[styles.input, errors.phoneNumber && styles.inputInvalid]}
              value={address}
              placeholder="ul. Remontowa 1"
              placeholderTextColor="#7b877d"
              onChangeText={setAddress}
            />

            <Text style={styles.label}>Telefon</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              keyboardType="phone-pad"
              placeholder="500123456"
              placeholderTextColor="#7b877d"
              onChangeText={text => setField('phoneNumber', text, setPhoneNumber)}
            />
            {errors.phoneNumber ? <Text style={styles.fieldError}>{errors.phoneNumber}</Text> : null}

            <Text style={styles.label}>Haslo</Text>
            <TextInput
              style={styles.input}
              value={password}
              secureTextEntry
              placeholder="Haslo"
              placeholderTextColor="#7b877d"
              onChangeText={text => setField('password', text, setPassword)}
            />
            {errors.password ? <Text style={styles.fieldError}>{errors.password}</Text> : null}

            <Pressable style={styles.primaryButton} onPress={register} disabled={loading}>
              {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.primaryText}>Utworz konto</Text>}
            </Pressable>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f1',
  },
  content: {
    paddingBottom: 28,
  },
  hero: {
    minHeight: 220,
    justifyContent: 'flex-end',
  },
  heroImage: {
    resizeMode: 'cover',
  },
  heroOverlay: {
    backgroundColor: 'rgba(21, 54, 35, 0.76)',
    padding: 22,
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
  modeRow: {
    flexDirection: 'row',
    gap: 10,
    padding: 14,
  },
  modeButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d6dfd2',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeButtonActive: {
    backgroundColor: '#1f6f43',
    borderColor: '#1f6f43',
  },
  modeText: {
    color: '#26342b',
    fontWeight: '900',
  },
  modeTextActive: {
    color: '#ffffff',
  },
  card: {
    marginHorizontal: 14,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dce4d8',
    padding: 16,
  },
  title: {
    color: '#1e2a22',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 8,
  },
  hint: {
    color: '#566359',
    lineHeight: 19,
  },
  label: {
    color: '#26342b',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 5,
    marginTop: 12,
  },
  input: {
    minHeight: 46,
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
  primaryButton: {
    minHeight: 48,
    borderRadius: 8,
    backgroundColor: '#1f6f43',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  primaryText: {
    color: '#ffffff',
    fontWeight: '900',
  },
});

export default AuthScreen;
