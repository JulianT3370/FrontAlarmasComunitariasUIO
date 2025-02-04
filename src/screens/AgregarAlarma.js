import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/AgregarAlarmaStyles";

function AgregarAlarma() {
  const navigation = useNavigation();
  const [alarmName, setAlarmName] = useState("");
  const [alarmAddress, setAlarmAddress] = useState("");
  const [cameraIP, setCameraIP] = useState("");
  const [cameraPort, setCameraPort] = useState("");
  const [cameraUser, setCameraUser] = useState("");
  const [cameraPassword, setCameraPassword] = useState("");
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Obtener ubicación
  const getLocation = async () => {
    if (location) {
      Alert.alert("Ubicación ya obtenida", "Ya tienes una ubicación registrada.");
      return;
    }

    setLoadingLocation(true);

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setLoadingLocation(false);
      Alert.alert("Permiso denegado", "Se necesita acceso a la ubicación.");
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    });

    setLoadingLocation(false);
    Alert.alert("Ubicación obtenida", "Ubicación registrada correctamente.");
  };

  // Guardar alarma
  const saveAlarm = () => {
    if (!alarmName || !alarmAddress || !location || !cameraIP || !cameraPort) {
      Alert.alert("Error", "Debe completar todos los campos obligatorios.");
      return;
    }

    navigation.navigate("LocationAccess", {
      newAlarm: {
        id: Date.now(),
        name: alarmName,
        address: alarmAddress,
        latitude: location.latitude,
        longitude: location.longitude,
        camera: {
          ip: cameraIP,
          port: cameraPort,
          user: cameraUser,
          password: cameraPassword,
        },
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Agregar Nueva Alarma</Text>

          {/* Nombre de la alarma */}
          <TextInput
            style={styles.input}
            placeholder="Nombre de la alarma"
            value={alarmName}
            onChangeText={setAlarmName}
          />

          {/* Dirección de la alarma */}
          <TextInput
            style={styles.input}
            placeholder="Dirección"
            value={alarmAddress}
            onChangeText={setAlarmAddress}
          />

          {/* Sección de datos de la Cámara IP */}
          <Text style={styles.sectionTitle}>Datos de la Cámara IP</Text>

          {/* Dirección IP */}
          <TextInput
            style={styles.input}
            placeholder="Dirección IP (Ej: 192.168.1.100)"
            value={cameraIP}
            onChangeText={setCameraIP}
            keyboardType="numeric"
          />

          {/* Puerto de la cámara */}
          <TextInput
            style={styles.input}
            placeholder="Puerto (Ej: 8080)"
            value={cameraPort}
            onChangeText={setCameraPort}
            keyboardType="numeric"
          />

          {/* Usuario de la cámara (opcional) */}
          <TextInput
            style={styles.input}
            placeholder="Usuario (Opcional)"
            value={cameraUser}
            onChangeText={setCameraUser}
          />

          {/* Contraseña de la cámara (opcional) */}
          <TextInput
            style={styles.input}
            placeholder="Contraseña (Opcional)"
            value={cameraPassword}
            onChangeText={setCameraPassword}
            secureTextEntry
          />

          {/* Botón para obtener ubicación */}
          <TouchableOpacity
            style={[styles.button, location && styles.buttonDisabled]}
            onPress={getLocation}
            disabled={loadingLocation || location !== null}
          >
            <Text style={styles.buttonText}>
              {loadingLocation
                ? "Obteniendo ubicación..."
                : location
                ? "Ubicación Registrada ✅"
                : "Obtener Ubicación 📍"}
            </Text>
          </TouchableOpacity>

          {/* Botón para guardar */}
          <TouchableOpacity style={styles.button} onPress={saveAlarm}>
            <Text style={styles.buttonText}>Guardar Alarma</Text>
          </TouchableOpacity>

          {/* Mostrar ubicación obtenida */}
          {location && (
            <Text style={styles.locationText}>
              📍 Latitud: {location.latitude}, Longitud: {location.longitude}
            </Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default AgregarAlarma;
