import { ScrollView, Text, StyleSheet, TouchableOpacity, View } from "react-native";
import * as Location from "expo-location";
import { useState, useEffect } from "react";
import MapView, { Marker } from 'react-native-maps';
import Icon from "react-native-vector-icons/MaterialIcons";

function LocationAccess({ navigation }) {
    const [location, setLocation] = useState(null);

    const requestLocationPermission = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                console.log("Permiso concedido");
                getLocation();
            } else {
                console.log("Permiso no concedido");
            }
        } catch (error) {
            console.warn(error);
        }
    };

    useEffect(() => {
        requestLocationPermission();
    }, []);

    const getLocation = async () => {
        try {
            const { coords } = await Location.getCurrentPositionAsync({});
            setLocation({ latitude: coords.latitude, longitude: coords.longitude });
            console.log(coords.latitude, coords.longitude);
        } catch (error) {
            alert("Error: " + error.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {location ? (
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.002,
                        longitudeDelta: 0.002,
                    }}>
                    <Marker coordinate={location} />
                </MapView>
            ) : null}
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
