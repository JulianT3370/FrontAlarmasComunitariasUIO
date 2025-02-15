import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView } from "react-native";
import * as Location from "expo-location";
import { handleSector } from "../services/handleSector";
import DialogScreen from "../partials/DialogScreen";
import { useNavigation } from "@react-navigation/native";
import { AGSectorStyle } from "../styles/AGSectorStyle";

const AgregarSector = () => {
    const navigation = useNavigation();

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
        // Si no, se solicita la ubicación actual mediante expo-location
        const requestLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permiso denegado", "No se pudo obtener la ubicación.");
                return;
            }
            let loc = await Location.getCurrentPositionAsync({});
            setLatitude(loc.coords.latitude.toString());
            setLongitude(loc.coords.longitude.toString());
        };
        requestLocation()
    }, []);

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
            } catch (error) {
                setMessage(error.message);
                setVisible(true);
            }
        } else {
            Alert.alert("Campos incompletos", "Por favor, completa todos los campos requeridos");
        }
    };

    return (
        <View style={AGSectorStyle.container}>
            <DialogScreen
                titulo="Notificación"
                descripcion={message}
                status={visible}
                eventCancel={() => {
                    setVisible(false);
                    navigation.goBack();
                }}
            />
            <Text style={AGSectorStyle.title}>Agregar Nuevo Sector</Text>
            <KeyboardAvoidingView behavior='height'>
                <TextInput
                    placeholder="Nombre del sector"
                    value={name}
                    onChangeText={setName}
                    style={AGSectorStyle.input}
                />
                <TextInput
                    placeholder="Latitud"
                    value={latitude}
                    editable={false}
                    keyboardType="numeric"
                    style={AGSectorStyle.readOnlyInput}
                />
                <TextInput
                    placeholder="Longitud"
                    value={longitude}
                    editable={false}
                    keyboardType="numeric"
                    style={AGSectorStyle.readOnlyInput}
                />
                <Text style={AGSectorStyle.cameraInfoTitle}>Información de la Cámara (Opcional)</Text>
                <TextInput
                    placeholder="IP de la Cámara"
                    value={cameraIP}
                    onChangeText={setCameraIP}
                    style={AGSectorStyle.input}
                />
                <TextInput
                    placeholder="Usuario de la Cámara"
                    value={cameraUser}
                    onChangeText={setCameraUser}
                    style={AGSectorStyle.input}
                />
                <TextInput
                    placeholder="Contraseña de la Cámara"
                    value={cameraPassword}
                    onChangeText={setCameraPassword}
                    secureTextEntry
                    style={AGSectorStyle.input}
                />
                <TouchableOpacity onPress={handleAddSector} style={AGSectorStyle.button}>
                    <Text style={AGSectorStyle.buttonText}>Guardar Sector</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    );

};

export default AgregarSector;
