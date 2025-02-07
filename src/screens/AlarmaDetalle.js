// AlarmaDetalle.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRoute, useNavigation } from '@react-navigation/native';

const AlarmaDetalle = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { alarm } = route.params;

  if (!alarm) {
    return (
      <View style={styles.container}>
        <Text>No se proporcionó ninguna alarma</Text>
      </View>
    );
  }

  // Definimos una región centrada en la ubicación de la alarma
  const region = {
    latitude: alarm.latitude,
    longitude: alarm.longitude,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  return (
    <View style={styles.container}>
      {/* Mapa centrado en la ubicación de la alarma */}
      <MapView style={styles.map} initialRegion={region}>
        <Marker coordinate={{ latitude: alarm.latitude, longitude: alarm.longitude }} />
      </MapView>

      {/* Detalles de la alarma */}
      <View style={styles.detailContainer}>
        <Text style={styles.title}>{alarm.name}</Text>
        <Text style={styles.address}>{alarm.address}</Text>
        <Text>Latitud: {alarm.latitude}</Text>
        <Text>Longitud: {alarm.longitude}</Text>
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

export default AlarmaDetalle;
