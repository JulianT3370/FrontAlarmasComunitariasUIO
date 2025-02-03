import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import MapView, { Marker } from "react-native-maps";

function AlarmaDetalle() {
    const navigation = useNavigation();
    const route = useRoute();
    const { alarm } = route.params; // 🔹 Recibe la alarma seleccionada

    return (
        <View style={styles.container}>
            {/* Botón de regresar */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={30} color="white" />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Detalles de la Alarma</Text>

                {/* Mapa con la ubicación de la alarma */}
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: alarm.latitude,
                        longitude: alarm.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                >
                    <Marker coordinate={{ latitude: alarm.latitude, longitude: alarm.longitude }} />
                </MapView>

                {/* Caja con información de la alarma */}
                <View style={styles.detailBox}>
                    <Text style={styles.label}>🔹 Nombre:</Text>
                    <Text style={styles.value}>{alarm.name}</Text>

                    <Text style={styles.label}>📍 Dirección:</Text>
                    <Text style={styles.value}>{alarm.address || "Dirección no disponible"}</Text>

                    <Text style={styles.label}>🌍 Coordenadas:</Text>
                    <Text style={styles.value}>Lat: {alarm.latitude.toFixed(6)}</Text>
                    <Text style={styles.value}>Lng: {alarm.longitude.toFixed(6)}</Text>
                </View>

                {/* Botón de regresar */}
                <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color="white" />
                    <Text style={styles.buttonText}>Regresar</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    scrollContainer: {
        padding: 20,
        alignItems: "center",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
    },
    map: {
        width: "100%",
        height: 250,
        borderRadius: 10,
        marginBottom: 20,
    },
    detailBox: {
        width: "100%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 10,
        color: "#555",
    },
    value: {
        fontSize: 16,
        color: "#333",
        marginBottom: 5,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#007AFF",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        justifyContent: "center",
        width: "100%",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 8,
    },
    backButton: {
        position: "absolute",
        top: 40,
        left: 20,
        backgroundColor: "#007AFF",
        borderRadius: 20,
        padding: 10,
        zIndex: 10,
    },
});

export default AlarmaDetalle;
