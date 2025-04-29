import React, { useState, useEffect } from 'react';
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
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft, CircleAlert as AlertCircle } from 'lucide-react-native';
import { useMotoContext } from '@/context/MotoContext';

const zonas = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'];
const statusOptions = ['Ativa', 'Inativa', 'Em Manutenção'];

export default function EditMoto() {
  const { getMotoById, updateMoto } = useMotoContext();
  const { id } = useLocalSearchParams();
  
  const [placa, setPlaca] = useState('');
  const [zona, setZona] = useState('');
  const [status, setStatus] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  useEffect(() => {
    if (id) {
      const moto = getMotoById(id as string);
      if (moto) {
        setPlaca(moto.placa || '');
        setZona(moto.zona || '');
        setStatus(moto.status || 'Ativa');
        setObservacoes(moto.observacoes || '');
      }
      setIsFetching(false);
    }
  }, [id, getMotoById]);
  
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
      const updatedMoto = {
        id: id as string,
        placa,
        zona,
        status,
        observacoes,
        dataAtualizacao: new Date().toISOString()
      };
      
      updateMoto(updatedMoto);
      
      Alert.alert(
        "Sucesso",
        "Motocicleta atualizada com sucesso!",
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

  if (isFetching) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#00C851" />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <StatusBar style="light" />
      
      <Stack.Screen 
        options={{
          title: 'Editar Moto',
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
            <TextInput
              style={[
                styles.input,
                errors.placa ? styles.inputError : null
              ]}
              value={placa}
              onChangeText={(text) => setPlaca(text.toUpperCase())}
              placeholder="ABC1D23"
              placeholderTextColor="#666666"
              autoCapitalize="characters"
              maxLength={7}
            />
            {errors.placa && (
              <Text style={styles.errorText}>{errors.placa}</Text>
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
              Esta edição atualizará a localização e status da motocicleta no sistema.
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
              <Text style={styles.submitButtonText}>Atualizar Motocicleta</Text>
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 16,
    fontSize: 16,
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