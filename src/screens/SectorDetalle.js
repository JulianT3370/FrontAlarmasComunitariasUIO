// SectorDetalle.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SectoDStyle } from '../styles/SectorDStyle';

const SectorDetalle = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { sector } = route.params;

  if (!sector) {
    return (
      <View style={SectoDStyle.container}>
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
    <View style={SectoDStyle.container}>
      {/* Mapa centrado en la ubicación del sector */}
      <MapView style={SectoDStyle.map} initialRegion={region}>
        <Marker coordinate={{ latitude: sector.latitud, longitude: sector.longitud }} />
      </MapView>

      {/* Detalles del sector */}
      <View style={SectoDStyle.detailContainer}>
        <Text style={SectoDStyle.title}>{sector.id}</Text>
        <Text>Latitud: {sector.latitud}</Text>
        <Text>Longitud: {sector.longitud}</Text>
        <TouchableOpacity style={SectoDStyle.button} onPress={() => navigation.goBack()}>
          <Text style={SectoDStyle.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SectorDetalle;
