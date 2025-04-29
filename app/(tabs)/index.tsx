import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { Recycle as Motorcycle, Plus, CreditCard as Edit } from 'lucide-react-native';
import { useMotoContext } from '@/context/MotoContext';
import { useBLEContext } from '@/context/BLEContext';
import { StatusBar } from 'expo-status-bar';

export default function Home() {
  const { motos } = useMotoContext();
  const { rssiLevel } = useBLEContext();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Mottu</Text>
        <Text style={styles.subtitle}>Gerenciamento de Pátio</Text>
        
        <View style={styles.signalIndicator}>
          <Text style={styles.signalText}>Sinal BLE: </Text>
          <View style={[styles.signalDot, 
            rssiLevel === 'high' ? styles.signalHigh : 
            rssiLevel === 'medium' ? styles.signalMedium : 
            styles.signalLow
          ]} />
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{motos.length}</Text>
            <Text style={styles.statLabel}>Motos Cadastradas</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {motos.filter(moto => moto.status === 'Ativa').length}
            </Text>
            <Text style={styles.statLabel}>Motos Ativas</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        
        <View style={styles.actionsContainer}>
          <Link href="/register-moto" asChild>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.iconContainer}>
                <Plus color="#FFFFFF" size={24} />
              </View>
              <Text style={styles.actionText}>Cadastrar Moto</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/(tabs)/patio-map" asChild>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.iconContainer}>
                <Motorcycle color="#FFFFFF" size={24} />
              </View>
              <Text style={styles.actionText}>Ver Mapa do Pátio</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/(tabs)/history" asChild>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.iconContainer}>
                <Edit color="#FFFFFF" size={24} />
              </View>
              <Text style={styles.actionText}>Gerenciar Motos</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#1A1A1A',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00C851',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 4,
  },
  signalIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  signalText: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  signalDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  signalHigh: {
    backgroundColor: '#00C851',
  },
  signalMedium: {
    backgroundColor: '#FFB400',
  },
  signalLow: {
    backgroundColor: '#FF4D4D',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  statCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    borderLeftWidth: 3,
    borderLeftColor: '#00C851',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#AAAAAA',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 16,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#00C851',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});