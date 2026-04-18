import React, { useState } from 'react';
import { Pressable, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import AdminDashboard from './src/components/AdminDashboard';
import AuthScreen, { Session } from './src/components/AuthScreen';
import CustomerHome from './src/components/CustomerHome';
//import RootNavigator from './src/navigation/RootNavigator';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const [session, setSession] = useState<Session | null>(null);

  const logout = () => setSession(null);

  if (!session) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <AuthScreen onLogin={setSession} />
      </View>
    );
  }

  if (session.role === 'client') {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <CustomerHome client={session.client} onLogout={logout} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.adminBar}>
        <View style={styles.adminText}>
          <Text style={styles.adminTitle}>Panel administratora</Text>
          <Text style={styles.adminSubtitle}>Zalogowano jako {session.name}</Text>
        </View>
        <Pressable style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Wyloguj</Text>
        </Pressable>
      </View>
      <AdminDashboard />
      {/* <RootNavigator /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f1',
  },
  adminBar: {
    backgroundColor: '#1e2a22',
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  adminText: {
    flex: 1,
  },
  adminTitle: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 15,
  },
  adminSubtitle: {
    color: '#dce4d8',
    fontSize: 12,
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: '#f4c430',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logoutText: {
    color: '#26342b',
    fontWeight: '900',
  },
});

export default App;
