import React from "react";
import { View, Text, ScrollView, SafeAreaView } from "react-native";
import { useRoute } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import styles from "../styles/AlarmaDetalleStyles"; // Asegúrate de que la ruta sea correcta

function AlarmaDetalle() {
  const route = useRoute();
  const { alarm } = route.params; // Recibe la alarma seleccionada

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Detalles de la Alarma</Text>

          {/* Mapa con la ubicación de la alarma */}
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: alarm.latitude,
              longitude: alarm.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker coordinate={{ latitude: alarm.latitude, longitude: alarm.longitude }} />
          </MapView>

          {/* Caja con información de la alarma */}
          <View style={styles.detailBox}>
            <Text style={styles.label}>🔹 Nombre:</Text>
            <Text style={styles.value}>{alarm.name}</Text>

            <Text style={styles.label}>📍 Dirección:</Text>
            <Text style={styles.value}>
              {alarm.address || "Dirección no disponible"}
            </Text>

            <Text style={styles.label}>🌍 Coordenadas:</Text>
            <Text style={styles.value}>Lat: {alarm.latitude.toFixed(6)}</Text>
            <Text style={styles.value}>Lng: {alarm.longitude.toFixed(6)}</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default AlarmaDetalle;
