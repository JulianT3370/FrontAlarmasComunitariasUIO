import { ScrollView, Text, StyleSheet, TouchableOpacity, View } from "react-native";
import * as Location from "expo-location";
import { useState, useEffect } from "react";
import MapView, { Marker, Circle } from 'react-native-maps';
import Icon from "react-native-vector-icons/MaterialIcons";

function LocationAccess({ navigation }) {
    const [location, setLocation] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const [alarms, setAlarms] = useState([
        { id: 1, latitude: -34.6037, longitude: -58.3816 }, // Ejemplo: Alarma en Buenos Aires
        { id: 2, latitude: -34.605, longitude: -58.38 },    // Otra alarma cercana
    ]);
    const radius = 100; // Radio en metros

    const haversine = (lat1, lon1, lat2, lon2) => {
        const toRad = (x) => (x * Math.PI) / 180;
        const R = 6371; // Radio de la Tierra en km

        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distancia en km
        return distance * 1000; // Convertir a metros
    };

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

    const startLocationTracking = async () => {
        try {
            const locationSubscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 3000, // Actualización cada 3 segundos
                    distanceInterval: 1,  // Actualizar cada 1 metro
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

    useEffect(() => {
        requestLocationPermission();

        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, []);

    const nearbyAlarms = location
        ? alarms.filter((alarm) => {
              const distance = haversine(
                  location.latitude,
                  location.longitude,
                  alarm.latitude,
                  alarm.longitude
              );
              return distance <= radius;
          })
        : [];

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
                    <Circle
                        center={location}
                        radius={radius}
                        strokeColor="rgba(0, 0, 255, 0.5)"
                        fillColor="rgba(0, 0, 255, 0.2)"
                    />
                    {nearbyAlarms.map((alarm) => (
                        <Marker
                            key={alarm.id}
                            coordinate={{ latitude: alarm.latitude, longitude: alarm.longitude }}
                            pinColor="red"
                        />
                    ))}
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
});

export default LocationAccess;