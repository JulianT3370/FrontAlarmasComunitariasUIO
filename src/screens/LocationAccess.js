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
import { useState, useEffect} from "react";
import { StyleSheet } from "react-native";

function LocationAccess({ navigation }) {
    const [location, setLocation] = useState(null);
    const [subscription, setSubscription] = useState(null);

    // Solicitar permisos y comenzar a rastrear la ubicación en tiempo real
    const requestLocationPermission = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                console.log("Permiso concedido");
                startLocationTracking();
            } else {
                console.log("Permiso no concedido");
            }
        } catch (error) {
            console.warn(error);
        }
    };

    // Función para rastrear la ubicación en tiempo real
    const startLocationTracking = async () => {
        try {
            const locationSubscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 3000, // Actualización cada 5 segundos
                    distanceInterval: 1,  // Actualizar cada 10 metros
                },
                (newLocation) => {
                    setLocation({
                        latitude: newLocation.coords.latitude,
                        longitude: newLocation.coords.longitude,
                    });
                    console.log("Ubicación actualizada:", newLocation.coords.latitude, newLocation.coords.longitude);
                }
            );
            setSubscription(locationSubscription);
        } catch (error) {
            console.warn("Error al obtener la ubicación en tiempo real:", error);
        }
    };

    // Efecto para solicitar permisos al montar el componente
    useEffect(() => {
        requestLocationPermission();

        // Limpiar la suscripción cuando se desmonte el componente
        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {location ? (
                <MapView
                    style={styles.map}
                    region={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.002,
                        longitudeDelta: 0.002,
                    }}
                >
                    <Marker coordinate={location} />
                </MapView>
            ) : (
                <Text style={styles.text}>Obteniendo ubicación...</Text>
            )}
            <Text style={styles.text}>
                Alarmas Comunitarias registradas en su sector
            </Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.iconContainer} onPress={() => { navigation.navigate("AddGroup") }}>
                    <Icon name="add" size={40} color="white" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.newAlarmButton} onPress={() => navigation.navigate("NuevaAlarma")}>
                    <Text style={styles.newAlarmText}>Nueva Alarma</Text>
                </TouchableOpacity>

            </View>
            <TouchableOpacity style={styles.microphone} onPress={() => navigation.navigate("Microphone")}>
                <Icon name="mic" size={40} color="blue" />
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    map: {
        height: 400,
        width: '100%',
    },
    text: {
        padding: 10,
        fontSize: 15,
        textAlign: "center",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: 1,
        marginTop: 20,
    },
    iconContainer: {
        width: 60,
        height: 60,
        backgroundColor: "blue",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        marginRight: 20,
    },
    newAlarmButton: {
        backgroundColor: "blue",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    newAlarmText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    microphone: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30,
    },
});

export default LocationAccess;
