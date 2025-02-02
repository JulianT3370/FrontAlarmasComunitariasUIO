import { ScrollView, Text, StyleSheet, TouchableOpacity, View } from "react-native";
import * as Location from "expo-location";
import { useState, useEffect } from "react";
import MapView, { Marker, Circle } from 'react-native-maps';
import Icon from "react-native-vector-icons/MaterialIcons";
import SpeechToText from "./SpeechToText"; // Importamos el componente

function LocationAccess({ navigation }) {
    const [location, setLocation] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const [recognizedText, setRecognizedText] = useState(""); // Estado para almacenar el texto del micrófono
    const radius = 100;

    const requestLocationPermission = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                startLocationTracking();
            }
        } catch (error) {
            console.warn(error);
        }
    };

    const startLocationTracking = async () => {
        try {
            const locationSubscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 3000,
                    distanceInterval: 1,
                },
                (newLocation) => {
                    setLocation({
                        latitude: newLocation.coords.latitude,
                        longitude: newLocation.coords.longitude,
                    });
                }
            );
            setSubscription(locationSubscription);
        } catch (error) {
            console.warn("Error al obtener la ubicación en tiempo real:", error);
        }
    };

    useEffect(() => {
        requestLocationPermission();
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
                    <Circle center={location} radius={radius} strokeColor="rgba(0, 0, 255, 0.5)" fillColor="rgba(0, 0, 255, 0.2)" />
                </MapView>
            ) : (
                <Text style={styles.text}>Obteniendo ubicación...</Text>
            )}
            <Text style={styles.text}>Alarmas Comunitarias registradas en su sector</Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.iconContainer} onPress={() => { navigation.navigate("AddGroup") }}>
                    <Icon name="add" size={40} color="white" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.newAlarmButton} onPress={() => navigation.navigate("NuevaAlarma")}>
                    <Text style={styles.newAlarmText}>Nueva Alarma</Text>
                </TouchableOpacity>
            </View>

            {/* Micrófono con reconocimiento de voz */}
            <SpeechToText onTextRecognized={setRecognizedText} />

            {/* Indica el texto reconocido */}
            <View style={styles.textContainer}>
                <Text style={styles.recognizedTextTitle}>Texto Reconocido:</Text>
                <Text style={styles.recognizedText}>{recognizedText ? recognizedText : "Habla para ver el texto aquí"}</Text>
            </View>
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
    textContainer: {
        marginTop: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        backgroundColor: "#f8f8f8",
    },
    recognizedTextTitle: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    recognizedText: {
        fontSize: 14,
        textAlign: "center",
        marginTop: 5,
        color: "#555",
    },
});

export default LocationAccess;
