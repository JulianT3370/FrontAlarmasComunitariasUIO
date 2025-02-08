import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView } from "react-native";
import { useRoute } from "@react-navigation/native";
import * as Location from "expo-location";
import { handleSector } from "../services/handleSector";
import DialogScreen from "../partials/DialogScreen";
import { useNavigation } from "@react-navigation/native";

const AgregarSector = () => {
    const navigation = useNavigation();
    const route = useRoute();
    // Se recibe el callback para agregar el sector y, opcionalmente, la ubicación actual
    const { onAddSector, currentLocation } = route.params || {};

    // Estados para almacenar los datos del formulario del sector
    const [name, setName] = useState("");
    // Estados para la latitud y longitud (que serán obtenidas automáticamente)
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");

    // Estados para almacenar los datos opcionales de la cámara
    const [cameraIP, setCameraIP] = useState("");
    const [cameraUser, setCameraUser] = useState("");
    const [cameraPassword, setCameraPassword] = useState("");

    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState("");

    // Al montar el componente, se obtiene la ubicación actual.
    useEffect(() => {
        // Si se recibió la ubicación a través de parámetros, se utiliza esa
        if (currentLocation) {
            setLatitude(currentLocation.latitude.toString());
            setLongitude(currentLocation.longitude.toString());
        } else {
            // Si no, se solicita la ubicación actual mediante expo-location
            (async () => {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    Alert.alert("Permiso denegado", "No se pudo obtener la ubicación.");
                    return;
                }
                let loc = await Location.getCurrentPositionAsync({});
                setLatitude(loc.coords.latitude.toString());
                setLongitude(loc.coords.longitude.toString());
            })();
        }
    }, [currentLocation]);

    const handleAddSector = () => {
        if (name && latitude && longitude) {
            const newSector = {
                name,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
            };

            // Validación de la cámara
            if (cameraIP || cameraUser || cameraPassword) {
                newSector.camera = {
                    ip: cameraIP,
                    user: cameraUser,
                    password: cameraPassword,
                };
            }

            try {
                const response = handleSector({ newSector });
                setMessage(response);
                setVisible(true);
                if (onAddSector) {
                    onAddSector(newSector);
                }
            } catch (error) {
                setMessage(error.message);
                setVisible(true);
            }
        } else {
            Alert.alert("Campos incompletos", "Por favor, completa todos los campos requeridos");
        }
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <DialogScreen
                titulo="Notificación"
                descripcion={message}
                status={visible}
                eventCancel={() => {
                    setVisible(false)
                    navigation.goBack()
                }}
            />
            <Text style={{ fontSize: 20, marginBottom: 10 }}>Agregar Nuevo Sector</Text>
            <KeyboardAvoidingView
                behavior='height'
            >
                <TextInput
                    placeholder="Nombre del sector"
                    value={name}
                    onChangeText={setName}
                    style={{
                        borderWidth: 1,
                        borderColor: "#ccc",
                        padding: 10,
                        marginBottom: 10,
                    }}
                />
                {/* Los campos de latitud y longitud se obtienen automáticamente y son de solo lectura */}
                <TextInput
                    placeholder="Latitud"
                    value={latitude}
                    editable={false}
                    keyboardType="numeric"
                    style={{
                        borderWidth: 1,
                        borderColor: "#ccc",
                        padding: 10,
                        marginBottom: 10,
                        backgroundColor: "#f0f0f0",
                    }}
                />
                <TextInput
                    placeholder="Longitud"
                    value={longitude}
                    editable={false}
                    keyboardType="numeric"
                    style={{
                        borderWidth: 1,
                        borderColor: "#ccc",
                        padding: 10,
                        marginBottom: 10,
                        backgroundColor: "#f0f0f0",
                    }}
                />

                {/* Sección opcional para la información de la cámara */}
                <Text style={{ fontSize: 18, marginVertical: 10 }}>
                    Información de la Cámara (Opcional)
                </Text>
                <TextInput
                    placeholder="IP de la Cámara"
                    value={cameraIP}
                    onChangeText={setCameraIP}
                    style={{
                        borderWidth: 1,
                        borderColor: "#ccc",
                        padding: 10,
                        marginBottom: 10,
                    }}
                />
                <TextInput
                    placeholder="Usuario de la Cámara"
                    value={cameraUser}
                    onChangeText={setCameraUser}
                    style={{
                        borderWidth: 1,
                        borderColor: "#ccc",
                        padding: 10,
                        marginBottom: 10,
                    }}
                />
                <TextInput
                    placeholder="Contraseña de la Cámara"
                    value={cameraPassword}
                    onChangeText={setCameraPassword}
                    secureTextEntry
                    style={{
                        borderWidth: 1,
                        borderColor: "#ccc",
                        padding: 10,
                        marginBottom: 10,
                    }}
                />

                <TouchableOpacity
                    onPress={handleAddSector}
                    style={{
                        backgroundColor: "blue",
                        padding: 10,
                        borderRadius: 5,
                        marginTop: 10,
                    }}
                >
                    <Text style={{ color: "white", textAlign: "center" }}>
                        Guardar Sector
                    </Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    );
};

export default AgregarSector;
