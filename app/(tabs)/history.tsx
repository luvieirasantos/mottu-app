import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { Link } from 'expo-router';
import { CreditCard as Edit2, Trash2, Plus, CircleAlert as AlertCircle } from 'lucide-react-native';
import { useMotoContext } from '@/context/MotoContext';
import { StatusBar } from 'expo-status-bar';

export default function History() {
  const { motos, removeMoto } = useMotoContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = (id: string) => {
    Alert.alert(
      "Confirmação",
      "Tem certeza que deseja remover esta motocicleta?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Remover", 
          onPress: () => {
            setIsLoading(true);
            setTimeout(() => {
              removeMoto(id);
              setIsLoading(false);
            }, 500);
          },
          style: "destructive"
        }
      ]
    );
  };

  const renderZoneBadge = (zone: string) => {
    const zoneColors: {[key: string]: string} = {
      'A': '#4287f5',
      'B': '#f542a1',
      'C': '#42f5b3',
      'D': '#f5a442',
    };
    
    const colorKey = zone.charAt(0);
    const backgroundColor = zoneColors[colorKey] || '#888888';
    
    return (
      <View style={[styles.zoneBadge, { backgroundColor }]}>
        <Text style={styles.zoneBadgeText}>{zone}</Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.motoCard}>
      <View style={styles.motoInfo}>
        <Text style={styles.motoPlate}>{item.placa}</Text>
        <View style={styles.motoDetails}>
          {renderZoneBadge(item.zona)}
          <View style={[styles.statusIndicator, 
            item.status === 'Ativa' ? styles.statusActive : styles.statusInactive
          ]} />
          <Text style={styles.motoStatus}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.actions}>
        <Link href={{ pathname: "/edit-moto", params: { id: item.id } }} asChild>
          <TouchableOpacity style={styles.editButton}>
            <Edit2 color="#FFFFFF" size={18} />
          </TouchableOpacity>
        </Link>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
          <Trash2 color="#FFFFFF" size={18} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Histórico de Motos</Text>
        <Link href="/register-moto" asChild>
          <TouchableOpacity style={styles.addButton}>
            <Plus color="#FFFFFF" size={20} />
          </TouchableOpacity>
        </Link>
      </View>

      {motos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <AlertCircle color="#AAAAAA" size={50} />
          <Text style={styles.emptyText}>Nenhuma motocicleta cadastrada</Text>
          <Link href="/register-moto" asChild>
            <TouchableOpacity style={styles.emptyButton}>
              <Text style={styles.emptyButtonText}>Cadastrar Moto</Text>
            </TouchableOpacity>
          </Link>
        </View>
      ) : (
        <FlatList
          data={motos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#00C851',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  motoCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  motoInfo: {
    flex: 1,
  },
  motoPlate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  motoDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  zoneBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  zoneBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusActive: {
    backgroundColor: '#00C851',
  },
  statusInactive: {
    backgroundColor: '#FF4D4D',
  },
  motoStatus: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#2C6BED',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#ED2C2C',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#AAAAAA',
    marginTop: 16,
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: '#00C851',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});