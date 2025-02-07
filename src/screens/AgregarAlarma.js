// AgregarAlarma.js
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";

const AgregarAlarma = () => {
  const route = useRoute();
  const navigation = useNavigation();
  // Se recibe el callback para agregar la alarma y, opcionalmente, la ubicación actual
  const { onAddAlarm, currentLocation } = route.params || {};

  // Estados para almacenar los datos del formulario de la alarma
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  // Estados para la latitud y longitud (que serán obtenidas automáticamente)
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // Estados para almacenar los datos opcionales de la cámara
  const [cameraIP, setCameraIP] = useState("");
  const [cameraUser, setCameraUser] = useState("");
  const [cameraPassword, setCameraPassword] = useState("");

  // Al montar el componente, se obtiene la ubicación actual.
  useEffect(() => {
    // Si se recibió la ubicación a través de parámetros, se utiliza esa
    if (currentLocation) {
      setLatitude(currentLocation.latitude.toString());
      setLongitude(currentLocation.longitude.toString());
    } else {
      // Si no, se solicita la ubicación actual mediante expo-location
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permiso denegado", "No se pudo obtener la ubicación.");
          return;
        }
        let loc = await Location.getCurrentPositionAsync({});
        setLatitude(loc.coords.latitude.toString());
        setLongitude(loc.coords.longitude.toString());
      })();
    }
  }, [currentLocation]);

  const handleAddAlarm = () => {
    if (name && address && latitude && longitude) {
      // Se crea el objeto de la alarma, incluyendo la ubicación exacta de creación
      const newAlarm = {
        id: Date.now(), // Se usa el timestamp para generar un id único
        name,
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      };

      // Si se ingresó información para la cámara, se agrega el objeto "camera"
      if (cameraIP || cameraUser || cameraPassword) {
        newAlarm.camera = {
          ip: cameraIP,
          user: cameraUser,
          password: cameraPassword,
        };
      }

      if (onAddAlarm) {
        onAddAlarm(newAlarm);
      }
      navigation.goBack();
    } else {
      Alert.alert("Campos incompletos", "Por favor, completa todos los campos requeridos");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Agregar Nueva Alarma</Text>
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
      {/* Los campos de latitud y longitud se obtienen automáticamente y son de solo lectura */}
      <TextInput
        placeholder="Latitud"
        value={latitude}
        editable={false}
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 10,
          backgroundColor: "#f0f0f0",
        }}
      />
      <TextInput
        placeholder="Longitud"
        value={longitude}
        editable={false}
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 10,
          backgroundColor: "#f0f0f0",
        }}
      />

      {/* Sección opcional para la información de la cámara */}
      <Text style={{ fontSize: 18, marginVertical: 10 }}>
        Información de la Cámara (Opcional)
      </Text>
      <TextInput
        placeholder="IP de la Cámara"
        value={cameraIP}
        onChangeText={setCameraIP}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 10,
        }}
      />
      <TextInput
        placeholder="Usuario de la Cámara"
        value={cameraUser}
        onChangeText={setCameraUser}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 10,
        }}
      />
      <TextInput
        placeholder="Contraseña de la Cámara"
        value={cameraPassword}
        onChangeText={setCameraPassword}
        secureTextEntry
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
