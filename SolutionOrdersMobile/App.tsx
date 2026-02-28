import React from 'react';
import { ScrollView, StyleSheet, useColorScheme, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Greeting from './src/components/Greeting';
import Counter from './src/components/Counter';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView>
      <Counter />
      <Greeting name="Damian Stasik" age={18} isVip={true} />
      <Greeting name="Krzysztof Łopucki" age={18} isVip={true} />
      <Greeting name="Madgalena Domaszczyńska" age={18} isVip={true} />
      <Greeting name="Grzegorz Wolfinger" age={18} isVip={true} />
      <Greeting name="Zuzanna Kompiel" age={18} isVip={true} />
      <Greeting name="Andrzej Zgódka" age={18} isVip={true} />
      <Greeting name="Piotr Bołoz" age={18} isVip={true} />
      <Greeting name="Sebastian Tomaszewski" age={18} isVip={true} />
      <Greeting name="Tomasz Saran" age={18} isVip={true} />
      <Greeting name="Maciej Kordalski" age={18} isVip={true} />
    </ScrollView>
    </SafeAreaView>
      
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default App;