import { useState, useEffect } from "react";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    TextInput,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, Circle } from "react-native-maps";
import Icon from "react-native-vector-icons/MaterialIcons";
import styles from "../styles/LocationAccessStyles";

function LocationAccess({ navigation }) {
    const [location, setLocation] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const radius = 20; // 🔹 Radio de 20 metros

    // 🔹 Dos alarmas predefinidas dentro de los 20 metros
    const [alarms, setAlarms] = useState([
        { id: 1, latitude: 37.78826, longitude: -122.4324, name: "Alarma 1" },
        { id: 2, latitude: 37.78835, longitude: -122.4323, name: "Alarma 2" }
    ]);

    // 🔹 Permisos de ubicación
    const requestLocationPermission = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
            startLocationTracking();
        } else {
            console.log("Permiso denegado");
        }
    };

    // 🔹 Rastreo de ubicación en tiempo real
    const startLocationTracking = async () => {
        const locationSubscription = await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.High,
                timeInterval: 3000,
                distanceInterval: 1
            },
            (newLocation) => {
                setLocation({
                    latitude: newLocation.coords.latitude,
                    longitude: newLocation.coords.longitude
                });
            }
        );
        setSubscription(locationSubscription);
    };

    useEffect(() => {
        requestLocationPermission();
        return () => {
            if (subscription) subscription.remove();
        };
    }, []);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {location ? (
                    <MapView
                        style={styles.map}
                        region={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.0005,
                            longitudeDelta: 0.0005
                        }}
                    >
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
                                    longitude: alarm.longitude
                                }}
                                pinColor="red"
                                onPress={() => navigation.navigate("AlarmaDetalle")}
                            />
                        ))}
                    </MapView>
                ) : (
                    <Text style={styles.text}>Obteniendo ubicación...</Text>
                )}

                <Text style={styles.text}>Alarmas Comunitarias Registradas en el sector:</Text>
                {alarms.map((alarm) => (
                    <TouchableOpacity key={alarm.id} style={styles.alarmItem} onPress={() => navigation.navigate("AlarmaDetalle")}>
                        <Icon name="notifications" size={20} color="blue" />
                        <Text style={styles.alarmText}>{alarm.name}</Text>
                    </TouchableOpacity>
                ))}

                <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("NuevaAlarma")}>
                    <Icon name="add" size={40} color="white" />
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>Generar Alarma Comunitaria</Text>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.input} placeholder="Mensaje..." />
                    <TouchableOpacity>
                        <Icon name="mic" size={24} color="gray" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.generateButton}>
                    <Text style={styles.generateButtonText}>Generar</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default LocationAccess;
