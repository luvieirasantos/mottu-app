import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useBLEContext } from '@/context/BLEContext';
import { StatusBar } from 'expo-status-bar';
import { TriangleAlert as AlertTriangle, WifiOff, Wifi, WifiLow } from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withSequence, 
  useSharedValue 
} from 'react-native-reanimated';

export default function Settings() {
  const { rssiLevel, setRssiLevel } = useBLEContext();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const scaleAnim = useSharedValue(1);
  
  const handleRssiChange = (level: string) => {
    // Trigger animation
    scaleAnim.value = withSequence(
      withSpring(1.1, { damping: 10 }),
      withSpring(1, { damping: 15 })
    );
    
    // Update RSSI level
    setRssiLevel(level);
  };
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleAnim.value }],
    };
  });
  
  const handleNotificationToggle = () => {
    setNotificationsEnabled(previous => !previous);
    
    if (!notificationsEnabled) {
      Alert.alert(
        "Notificações Ativadas",
        "Você será notificado sobre alterações no status das motos.",
        [{ text: "OK" }]
      );
    }
  };
  
  const handleClearData = () => {
    Alert.alert(
      "Confirmação",
      "Tem certeza que deseja limpar todos os dados do aplicativo? Esta ação não pode ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Limpar Dados", 
          onPress: () => {
            Alert.alert("Dados Limpos", "Todos os dados foram removidos.");
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Configurações</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Geral</Text>
        
        <View style={styles.setting}>
          <Text style={styles.settingText}>Notificações</Text>
          <Switch
            trackColor={{ false: '#333333', true: 'rgba(0, 200, 81, 0.5)' }}
            thumbColor={notificationsEnabled ? '#00C851' : '#767577'}
            ios_backgroundColor="#333333"
            onValueChange={handleNotificationToggle}
            value={notificationsEnabled}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Simulação de Sinal BLE</Text>
        <Text style={styles.sectionDescription}>
          Selecione a intensidade do sinal BLE para simular a detecção das motos.
        </Text>
        
        <Animated.View style={[styles.signalButtons, animatedStyle]}>
          <TouchableOpacity 
            style={[
              styles.signalButton, 
              rssiLevel === 'high' && styles.signalButtonActive
            ]}
            onPress={() => handleRssiChange('high')}
          >
            <Wifi color={rssiLevel === 'high' ? '#FFFFFF' : '#00C851'} size={24} />
            <Text style={[
              styles.signalButtonText,
              rssiLevel === 'high' && styles.signalButtonTextActive
            ]}>Forte</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.signalButton, 
              rssiLevel === 'medium' && styles.signalButtonActive
            ]}
            onPress={() => handleRssiChange('medium')}
          >
            <WifiLow color={rssiLevel === 'medium' ? '#FFFFFF' : '#FFB400'} size={24} />
            <Text style={[
              styles.signalButtonText,
              rssiLevel === 'medium' && styles.signalButtonTextActive
            ]}>Médio</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.signalButton, 
              rssiLevel === 'low' && styles.signalButtonActive
            ]}
            onPress={() => handleRssiChange('low')}
          >
            <WifiOff color={rssiLevel === 'low' ? '#FFFFFF' : '#FF4D4D'} size={24} />
            <Text style={[
              styles.signalButtonText,
              rssiLevel === 'low' && styles.signalButtonTextActive
            ]}>Fraco</Text>
          </TouchableOpacity>
        </Animated.View>
        
        <View style={styles.signalInfo}>
          <AlertTriangle color="#FFB400" size={20} />
          <Text style={styles.signalInfoText}>
            Isso é apenas uma simulação. Em um ambiente real, o sinal BLE seria detectado automaticamente.
          </Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dados</Text>
        
        <TouchableOpacity style={styles.dangerButton} onPress={handleClearData}>
          <Text style={styles.dangerButtonText}>Limpar Todos os Dados</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Mottu Gerenciamento de Pátio</Text>
        <Text style={styles.versionText}>Versão 1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 16,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  signalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  signalButton: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  signalButtonActive: {
    backgroundColor: '#00C851',
  },
  signalButtonText: {
    marginTop: 8,
    fontSize: 14,
    color: '#FFFFFF',
  },
  signalButtonTextActive: {
    fontWeight: 'bold',
  },
  signalInfo: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 180, 0, 0.1)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  signalInfoText: {
    flex: 1,
    fontSize: 14,
    color: '#AAAAAA',
    marginLeft: 8,
  },
  dangerButton: {
    backgroundColor: '#FF4D4D',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  versionText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
});