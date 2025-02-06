import { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import MapView, { Marker } from "react-native-maps";
import styles from "../styles/LocationAccessStyles";

function AlarmaDetalle() {
    const route = useRoute();
    const { sector } = route.params;

    const ubicacionSector = {
        latitude : parseFloat(sector.latitud),
        longitude : parseFloat(sector.longitud)
    }

    useEffect(()=>{
        ubicacionSector
    }, [])

    return (
        <View style={styles.container}>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Detalles de la Alarma</Text>

                <MapView
                    style={styles.map}
                    initialRegion={{
                        ...ubicacionSector,
                        latitudeDelta: 0.0002,
                        longitudeDelta: 0.0002,
                    }}
                >
                    <Marker coordinate = {ubicacionSector}>
                        <Icon name="alarm" size={20} color="blue" />
                    </Marker>
                </MapView>

                <View style={styles.detailBox}>
                    <Text style={styles.label}>🔹 Nombre:</Text>
                    <Text style={styles.value}>{sector.nombre}</Text>

                    <Text style={styles.label}>🌍 Coordenadas:</Text>
                    <Text style={styles.value}>Lat: {ubicacionSector.latitude.toFixed(6)}</Text>
                    <Text style={styles.value}>Lng: {ubicacionSector.longitude.toFixed(6)}</Text>
                </View>
            </ScrollView>
        </View>
    );
}

export default AlarmaDetalle;
