import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, Circle } from "react-native-maps";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import styles from "../styles/LocationAccessStyles";

function LocationAccess() {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [inputFocused, setInputFocused] = useState(false);
  const radius = 20; // 20 metros

  // Alarmas predefinidas
  const [alarms, setAlarms] = useState([]);

  useEffect(() => {
    requestLocationPermission();
    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      startLocationTracking();
    } else {
      console.log("Permiso de ubicación no concedido");
    }
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

        if (!mapRegion) {
          setMapRegion({
            ...userLocation,
            latitudeDelta: 0.002,
            longitudeDelta: 0.002,
          });

          // Agregar alarmas dentro del radio de 20m
          setAlarms([
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
          ]);
        }
      }
    );
    setSubscription(locationSubscription);
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
                coordinate={{ latitude: alarm.latitude, longitude: alarm.longitude }}
                pinColor="red"
                onPress={() => navigation.navigate("AlarmaDetalle", { alarm })}
              />
            ))}
          </MapView>
        ) : (
          <Text style={styles.text}>Obteniendo ubicación...</Text>
        )}

        <View style={styles.alarmBox}>
          <Text style={styles.alarmTitle}>Alarmas Comunitarias Registradas en el sector:</Text>
          {alarms.map((alarm) => (
            <TouchableOpacity
              key={alarm.id}
              style={styles.alarmItem}
              onPress={() => navigation.navigate("AlarmaDetalle", { alarm })}
            >
              <Icon name="notifications" size={20} color="blue" />
              <View>
                <Text style={styles.alarmName}>{alarm.name}</Text>
                <Text style={styles.alarmAddress}>{alarm.address}</Text>
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("NuevaAlarma")}
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
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
            />
            <TouchableOpacity>
              <Icon name="mic" size={30} color="blue" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.generateButton}
            onPress={() => navigation.navigate("CamaraIP")}
          >
            <Text style={styles.generateButtonText}>Generar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


export default LocationAccess;
