import { StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import pingLibsignal from '../../modules/ping-libsignal';

export default function TestScreen() {
  const [moduleStatus, setModuleStatus] = useState<string>('Loading...');
  const [piValue, setPiValue] = useState<number | null>(null);
  const [helloResult, setHelloResult] = useState<string>('');
  const [libSignalResult, setLibSignalResult] = useState<{ pub: string; priv: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    initializeModule();
  }, []);

  const initializeModule = async () => {
    try {
      // Test basic module loading
      const hello = pingLibsignal.hello();
      setHelloResult(hello);
      
      // Get PI constant
      setPiValue(pingLibsignal.PI);
      
      setModuleStatus('Module loaded successfully!');
    } catch (error) {
      setModuleStatus(`Module error: ${error}`);
      Alert.alert('Module Error', `Failed to load pingLibSignal module: ${error}`);
    }
  };

  const testLibSignal = async () => {
    setIsLoading(true);
    setLibSignalResult(null);
    
    try {
      const result = await pingLibsignal.testLibSignal();
      setLibSignalResult(result);
    } catch (error) {
      Alert.alert('LibSignal Error', `Failed to test LibSignal: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const TestButton = ({ title, onPress, disabled = false }: { title: string; onPress: () => void; disabled?: boolean }) => (
    <TouchableOpacity 
      style={[styles.button, disabled && styles.buttonDisabled]} 
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  const ResultCard = ({ title, content }: { title: string; content: string | React.ReactNode }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={styles.cardContent}>
        {typeof content === 'string' ? (
          <Text style={styles.cardText}>{content}</Text>
        ) : (
          content
        )}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>pingLibSignal Test Screen</Text>
      
      <ResultCard title="Module Status" content={moduleStatus} />
      
      <ResultCard 
        title="PI Constant" 
        content={piValue !== null ? piValue.toString() : 'Not available'} 
      />
      
      <ResultCard title="Hello Function" content={helloResult || 'Not tested'} />
      
      <View style={styles.buttonContainer}>
        <TestButton 
          title="Test LibSignal" 
          onPress={testLibSignal}
          disabled={isLoading}
        />
      </View>
      
      {libSignalResult && (
        <ResultCard 
          title="LibSignal Result" 
          content={
            <View>
              <Text style={styles.keyText}>Public Key:</Text>
              <Text style={styles.keyValue}>{libSignalResult.pub}</Text>
              <Text style={styles.keyText}>Private Key:</Text>
              <Text style={styles.keyValue}>{libSignalResult.priv}</Text>
            </View>
          }
        />
      )}
      
      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
      
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    padding: 24,
    alignItems: 'center',
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 32,
    textAlign: 'center',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginVertical: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1a1a1a',
    letterSpacing: -0.2,
  },
  cardContent: {
    minHeight: 24,
  },
  cardText: {
    fontSize: 15,
    color: '#4a5568',
    lineHeight: 22,
    fontWeight: '400',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 24,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 140,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: '#cbd5e1',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  keyText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 12,
    marginBottom: 6,
  },
  keyValue: {
    fontSize: 13,
    color: '#4a5568',
    fontFamily: 'monospace',
    backgroundColor: '#f7fafc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    lineHeight: 18,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  separator: {
    marginVertical: 32,
    height: 1,
    width: '80%',
    backgroundColor: '#e5e7eb',
  },
});
