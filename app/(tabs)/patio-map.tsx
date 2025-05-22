import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useMotoContext } from '@/context/MotoContext';
import { useBLEContext } from '@/context/BLEContext';
import { StatusBar } from 'expo-status-bar';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  withSequence,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const MAP_WIDTH = Math.min(width - 32, 500);
const MAP_HEIGHT = MAP_WIDTH * 1.2;
const ZONES = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'];

export default function PatioMap() {
  const { motos } = useMotoContext();
  const { rssiLevel } = useBLEContext();
  
  const signalOpacity = useSharedValue(0.4);
  const signalScale = useSharedValue(1);
  
  React.useEffect(() => {
    signalOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1000 }),
        withTiming(0.4, { duration: 1000 })
      ),
      -1,
      true
    );
    
    signalScale.value = withRepeat(
      withSequence(
        withSpring(1.1),
        withSpring(1)
      ),
      -1,
      true
    );
  }, []);

  const getMotosInZone = (zone: string) => {
    return motos.filter(moto => moto.zona === zone);
  };

  const getSignalPosition = () => {
    switch (rssiLevel) {
      case 'high':
        return { top: '10%', left: '10%' }; // Near A zones
      case 'medium':
        return { top: '40%', left: '50%' }; // Near B zones
      case 'low':
        return { top: '80%', left: '80%' }; // Near D zones
      default:
        return { top: '50%', left: '50%' };
    }
  };

  const signalAnimatedStyle = useAnimatedStyle(() => ({
    opacity: signalOpacity.value,
    transform: [{ scale: signalScale.value }],
    ...getSignalPosition(),
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: rssiLevel === 'high' 
      ? 'rgba(0, 200, 81, 0.3)' 
      : rssiLevel === 'medium'
        ? 'rgba(255, 180, 0, 0.3)'
        : 'rgba(255, 77, 77, 0.3)',
  }));

  const renderParkingSpot = (zone: string, index: number) => {
    const motosInZone = getMotosInZone(zone);
    const moto = motosInZone[index];
    
    return (
      <View style={styles.parkingSpot}>
        {moto && (
          <View style={[styles.motoIndicator, moto.status === 'Ativa' ? styles.activeMoto : styles.inactiveMoto]}>
            <Text style={styles.motoPlate}>{moto.placa}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderZone = (zone: string) => {
    return (
      <View key={zone} style={styles.zoneContainer}>
        <View style={styles.zoneHeader}>
          <View style={styles.zoneLabelContainer}>
            <Text style={styles.zoneLabel}>{zone}</Text>
          </View>
        </View>
        <View style={styles.parkingArea}>
          <View style={styles.parkingRow}>
            {[0, 1].map((index) => (
              <React.Fragment key={index}>{renderParkingSpot(zone, index)}</React.Fragment>
            ))}
          </View>
          <View style={styles.parkingRow}>
            {[2, 3].map((index) => (
              <React.Fragment key={index}>{renderParkingSpot(zone, index)}</React.Fragment>
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mapa do Pátio</Text>
        <View style={styles.signalIndicator}>
          <Text style={styles.signalText}>
            Sinal BLE: {rssiLevel === 'high' ? 'Forte' : rssiLevel === 'medium' ? 'Médio' : 'Fraco'}
          </Text>
          <View style={[
            styles.signalDot,
            rssiLevel === 'high' ? styles.signalHigh :
            rssiLevel === 'medium' ? styles.signalMedium :
            styles.signalLow
          ]} />
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.mapContainer}>
          <View style={styles.buildingOutline}>
            <View style={styles.leftWing}>
              {['A1', 'B1', 'C1', 'D1'].map(zone => (
                <React.Fragment key={zone}>{renderZone(zone)}</React.Fragment>
              ))}
            </View>
            <View style={styles.corridor}>
              <View style={styles.stairs} />
              <View style={styles.entrance} />
            </View>
            <View style={styles.rightWing}>
              {['A2', 'B2', 'C2', 'D2'].map(zone => (
                <React.Fragment key={zone}>{renderZone(zone)}</React.Fragment>
              ))}
            </View>
          </View>
          {rssiLevel !== 'none' && (
            <Animated.View style={signalAnimatedStyle} />
          )}
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  signalIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signalText: {
    color: '#AAAAAA',
    fontSize: 14,
    marginRight: 8,
  },
  signalDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    alignItems: 'center',
  },
  mapContainer: {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    position: 'relative',
  },
  buildingOutline: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#333333',
    borderRadius: 8,
    overflow: 'hidden',
  },
  leftWing: {
    flex: 4,
    borderRightWidth: 1,
    borderRightColor: '#333333',
  },
  corridor: {
    flex: 1,
    backgroundColor: '#242424',
    justifyContent: 'space-between',
    padding: 8,
  },
  stairs: {
    height: 40,
    backgroundColor: '#333333',
    borderRadius: 4,
  },
  entrance: {
    height: 40,
    backgroundColor: '#333333',
    borderRadius: 4,
  },
  rightWing: {
    flex: 4,
    borderLeftWidth: 1,
    borderLeftColor: '#333333',
  },
  zoneContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  zoneHeader: {
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  zoneLabelContainer: {
    backgroundColor: '#00C851',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  zoneLabel: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  parkingArea: {
    flex: 1,
    padding: 4,
  },
  parkingRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  parkingSpot: {
    width: '45%',
    height: '80%',
    borderWidth: 1,
    borderColor: '#333333',
    borderStyle: 'dashed',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  motoIndicator: {
    padding: 4,
    borderRadius: 4,
    alignItems: 'center',
  },
  activeMoto: {
    backgroundColor: 'rgba(0, 200, 81, 0.2)',
    borderWidth: 1,
    borderColor: '#00C851',
  },
  inactiveMoto: {
    backgroundColor: 'rgba(255, 77, 77, 0.2)',
    borderWidth: 1,
    borderColor: '#FF4D4D',
  },
  motoPlate: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});