import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link, Stack, router } from 'expo-router';
import { ChevronLeft, Camera, CircleAlert as AlertCircle } from 'lucide-react-native';
import { useMotoContext } from '@/context/MotoContext';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const zonas = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'];
const statusOptions = ['Ativa', 'Inativa', 'Em Manutenção'];

export default function RegisterMoto() {
  const { addMoto } = useMotoContext();
  
  const [placa, setPlaca] = useState('');
  const [zona, setZona] = useState('');
  const [status, setStatus] = useState('Ativa');
  const [observacoes, setObservacoes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showQrHint, setShowQrHint] = useState(false);
  
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!placa) {
      newErrors.placa = 'Placa é obrigatória';
    } else if (!/^[A-Z]{3}[0-9][0-9A-Z][0-9]{2}$/.test(placa)) {
      newErrors.placa = 'Formato inválido (ex: ABC1D23)';
    }
    
    if (!zona) {
      newErrors.zona = 'Zona é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newMoto = {
        id: Date.now().toString(),
        placa,
        zona,
        status,
        observacoes,
        dataRegistro: new Date().toISOString()
      };
      
      addMoto(newMoto);
      
      Alert.alert(
        "Sucesso",
        "Motocicleta registrada com sucesso!",
        [
          { 
            text: "OK", 
            onPress: () => router.back() 
          }
        ]
      );
      
      setIsLoading(false);
    }, 1000);
  };
  
  const simulateQrScan = () => {
    setShowQrHint(true);
    
    setTimeout(() => {
      setPlaca('ABC1D23');
      setShowQrHint(false);
    }, 2000);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <StatusBar style="light" />
      
      <Stack.Screen 
        options={{
          title: 'Cadastrar Moto',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#121212',
          },
          headerTitleStyle: {
            color: '#FFFFFF',
          },
          headerTintColor: '#00C851',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft color="#00C851" size={24} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Placa</Text>
            <View style={styles.placaContainer}>
              <TextInput
                style={[
                  styles.input,
                  errors.placa ? styles.inputError : null,
                  { flex: 1 }
                ]}
                value={placa}
                onChangeText={(text) => setPlaca(text.toUpperCase())}
                placeholder="ABC1D23"
                placeholderTextColor="#666666"
                autoCapitalize="characters"
                maxLength={7}
              />
              <TouchableOpacity 
                style={styles.qrButton}
                onPress={simulateQrScan}
              >
                <Camera color="#FFFFFF" size={20} />
              </TouchableOpacity>
            </View>
            {errors.placa && (
              <Text style={styles.errorText}>{errors.placa}</Text>
            )}
            
            {showQrHint && (
              <Animated.View 
                style={styles.qrHint}
                entering={FadeIn}
                exiting={FadeOut}
              >
                <Text style={styles.qrHintText}>
                  Escaneando QR Code...
                </Text>
              </Animated.View>
            )}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Zona</Text>
            <View style={styles.zonaContainer}>
              {zonas.map((z) => (
                <TouchableOpacity
                  key={z}
                  style={[
                    styles.zonaButton,
                    zona === z && styles.zonaButtonActive
                  ]}
                  onPress={() => setZona(z)}
                >
                  <Text style={[
                    styles.zonaButtonText,
                    zona === z && styles.zonaButtonTextActive
                  ]}>{z}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.zona && (
              <Text style={styles.errorText}>{errors.zona}</Text>
            )}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.statusContainer}>
              {statusOptions.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.statusButton,
                    status === s && styles.statusButtonActive
                  ]}
                  onPress={() => setStatus(s)}
                >
                  <Text style={[
                    styles.statusButtonText,
                    status === s && styles.statusButtonTextActive
                  ]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Observações</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={observacoes}
              onChangeText={setObservacoes}
              placeholder="Detalhes adicionais sobre a motocicleta..."
              placeholderTextColor="#666666"
              multiline
              numberOfLines={4}
            />
          </View>
          
          <View style={styles.noteContainer}>
            <AlertCircle color="#FFB400" size={20} />
            <Text style={styles.noteText}>
              Por favor, verifique se a placa está correta antes de registrar a motocicleta.
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Registrar Motocicleta</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  placaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#FF4D4D',
  },
  errorText: {
    color: '#FF4D4D',
    fontSize: 14,
    marginTop: 4,
  },
  qrButton: {
    backgroundColor: '#00C851',
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  qrHint: {
    backgroundColor: 'rgba(0, 200, 81, 0.1)',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  qrHintText: {
    color: '#00C851',
    fontSize: 14,
  },
  zonaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  zonaButton: {
    width: '24%',
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  zonaButtonActive: {
    backgroundColor: '#00C851',
    borderColor: '#00C851',
  },
  zonaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  zonaButtonTextActive: {
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statusButtonActive: {
    backgroundColor: '#00C851',
    borderColor: '#00C851',
  },
  statusButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  statusButtonTextActive: {
    fontWeight: 'bold',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  noteContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 180, 0, 0.1)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: '#AAAAAA',
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: '#00C851',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});