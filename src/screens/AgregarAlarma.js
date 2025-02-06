// AgregarAlarma.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

const AgregarAlarma = () => {
  const route = useRoute();
  const navigation = useNavigation();
  // Se recibe el callback para agregar la alarma y, opcionalmente, la ubicación actual
  const { onAddAlarm, currentLocation } = route.params || {};

  // Estados para almacenar los datos del formulario
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  // Si se pasó la ubicación actual, se prellenan latitud y longitud
  const [latitude, setLatitude] = useState(
    currentLocation ? currentLocation.latitude.toString() : ""
  );
  const [longitude, setLongitude] = useState(
    currentLocation ? currentLocation.longitude.toString() : ""
  );

  const handleAddAlarm = () => {
    if (name && address && latitude && longitude) {
      const newAlarm = {
        id: Date.now(), // Se usa el timestamp para generar un id único
        name,
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      };

      if (onAddAlarm) {
        onAddAlarm(newAlarm);
      }
      navigation.goBack();
    } else {
      alert("Por favor, completa todos los campos");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>
        Agregar Nueva Alarma
      </Text>
      <TextInput
        placeholder="Nombre de la Alarma"
        value={name}
        onChangeText={setName}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 10,
        }}
      />
      <TextInput
        placeholder="Dirección"
        value={address}
        onChangeText={setAddress}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 10,
        }}
      />
      <TextInput
        placeholder="Latitud"
        value={latitude}
        onChangeText={setLatitude}
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 10,
        }}
      />
      <TextInput
        placeholder="Longitud"
        value={longitude}
        onChangeText={setLongitude}
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 10,
        }}
      />
      <TouchableOpacity
        onPress={handleAddAlarm}
        style={{
          backgroundColor: "blue",
          padding: 10,
          borderRadius: 5,
          marginTop: 10,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Guardar Alarma
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AgregarAlarma;
