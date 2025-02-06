// LocationAccess.js
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, Circle } from "react-native-maps";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles/LocationAccessStyles"; // Estilos para Location
import { axiosApi } from "../services/axiosFlask";

function LocationAccess() {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [alarms, setAlarms] = useState([]);
  const radius = 20; // Radio para el círculo en el mapa

  // Cargar alarmas persistidas desde AsyncStorage al iniciar
  useEffect(() => {
    const loadAlarms = async () => {
      try {
        const storedAlarms = await AsyncStorage.getItem("alarms");
        if (storedAlarms !== null) {
          setAlarms(JSON.parse(storedAlarms));
        }
      } catch (error) {
        console.error("Error al cargar alarmas:", error);
      }
    };

    loadAlarms();
    requestLocationPermission();

    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  // Función para guardar alarmas en AsyncStorage
  const saveAlarms = async (alarmsToSave) => {
    try {
      await AsyncStorage.setItem("alarms", JSON.stringify(alarmsToSave));
    } catch (error) {
      console.error("Error al guardar alarmas:", error);
    }
  };

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      startLocationTracking();
    } else {
      console.log("Permiso de ubicación no concedido");
    }
  };

  const getTitle = async (text) => {
    console.log("Enviando descripción");
    await axiosApi
      .post(
        "/text",
        { text: text },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => {
        if (response.data === "") {
          console.log("No se relaciona con seguridad comunitaria");
        } else {
          console.log(response.data);
          setTitle(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const startLocationTracking = async () => {
    const locationSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 3000,
        distanceInterval: 1,
      },
      (newLocation) => {
        const userLocation = {
          latitude: newLocation.coords.latitude,
          longitude: newLocation.coords.longitude,
        };
        setLocation(userLocation);

        // Inicializar la región y las alarmas de ejemplo solo una vez
        if (!mapRegion) {
          setMapRegion({
            ...userLocation,
            latitudeDelta: 0.002,
            longitudeDelta: 0.002,
          });

          // Si no hay alarmas guardadas, se asignan alarmas de ejemplo
          setAlarms((prevAlarms) => {
            if (prevAlarms.length === 0) {
              const exampleAlarms = [
                {
                  id: 1,
                  name: "La Gasca",
                  address: "1671 North Avenue, Tucson, AZ",
                  latitude: userLocation.latitude + 0.0001,
                  longitude: userLocation.longitude + 0.0001,
                },
                {
                  id: 2,
                  name: "Principal A",
                  address: "1234 Desert Road, Tucson, AZ",
                  latitude: userLocation.latitude - 0.0001,
                  longitude: userLocation.longitude - 0.0001,
                },
              ];
              saveAlarms(exampleAlarms);
              return exampleAlarms;
            } else {
              return prevAlarms;
            }
          });
        }
      }
    );
    setSubscription(locationSubscription);
  };

  // Callback para agregar una nueva alarma desde AgregarAlarma.js
  const handleAddAlarm = (newAlarm) => {
    const updatedAlarms = [...alarms, newAlarm];
    setAlarms(updatedAlarms);
    saveAlarms(updatedAlarms);
  };

  // Función para eliminar una alarma
  const handleDeleteAlarm = (alarmId) => {
    const updatedAlarms = alarms.filter((alarm) => alarm.id !== alarmId);
    setAlarms(updatedAlarms);
    saveAlarms(updatedAlarms);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {location ? (
          <MapView style={styles.map} initialRegion={mapRegion}>
            <Marker coordinate={location} />
            <Circle
              center={location}
              radius={radius}
              strokeColor="rgba(0, 0, 255, 0.5)"
              fillColor="rgba(0, 0, 255, 0.2)"
            />
            {alarms.map((alarm) => (
              <Marker
                key={alarm.id}
                coordinate={{
                  latitude: alarm.latitude,
                  longitude: alarm.longitude,
                }}
                pinColor="red"
                onPress={() =>
                  navigation.navigate("AlarmaDetalle", { alarm: alarm })
                }
              />
            ))}
          </MapView>
        ) : (
          <Text style={styles.text}>Obteniendo ubicación...</Text>
        )}

        <View style={styles.alarmBox}>
          <Text style={styles.alarmTitle}>
            Alarmas Comunitarias Registradas en el sector:
          </Text>
          {alarms.map((alarm) => (
            <View key={alarm.id} style={styles.alarmItemContainer}>
              <TouchableOpacity
                style={styles.alarmItem}
                onPress={() =>
                  navigation.navigate("AlarmaDetalle", { alarm: alarm })
                }
              >
                <Icon name="notifications" size={20} color="blue" />
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.alarmName}>{alarm.name}</Text>
                  <Text style={styles.alarmAddress}>{alarm.address}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteAlarm(alarm.id)}
              >
                <Icon name="delete" size={20} color="red" />
              </TouchableOpacity>
            </View>
          ))}
          {/* Botón para agregar una nueva alarma */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() =>
              navigation.navigate("AgregarAlarma", {
                onAddAlarm: handleAddAlarm,
                currentLocation: location,
              })
            }
          >
            <Icon name="add" size={40} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.generateAlarm}>
          <Text style={styles.generateTitle}>Generar Alarma Comunitaria</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Mensaje..."
              value={text}
              onChangeText={(value) => setText(value)}
            />
            <TouchableOpacity onPress={() => navigation.navigate("Microphone")}>
              <Icon name="mic" size={30} color="blue" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.generateButton}
            onPress={() => {
              if (text) {
                getTitle(text);
              }
            }}
          >
            <Text style={styles.generateButtonText}>Generar</Text>
            {title ? <Text>{title}</Text> : <Text>Aún no hay título</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default LocationAccess;
