// SectorDetalle.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRoute, useNavigation } from '@react-navigation/native';

const SectorDetalle = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { sector } = route.params;

  if (!sector) {
    return (
      <View style={styles.container}>
        <Text>No se proporcionó ningun sector</Text>
      </View>
    );
  }

  // Definimos una región centrada en la ubicación del sector
  const region = {
    latitude: sector.latitud,
    longitude: sector.longitud,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  return (
    <View style={styles.container}>
      {/* Mapa centrado en la ubicación del sector */}
      <MapView style={styles.map} initialRegion={region}>
        <Marker coordinate={{ latitude: sector.latitud, longitude: sector.longitud }} />
      </MapView>

      {/* Detalles del sector */}
      <View style={styles.detailContainer}>
        <Text style={styles.title}>{sector.id}</Text>
        <Text>Latitud: {sector.latitud}</Text>
        <Text>Longitud: {sector.longitud}</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  detailContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  address: {
    fontSize: 16,
    marginVertical: 8,
  },
  button: {
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default SectorDetalle;
