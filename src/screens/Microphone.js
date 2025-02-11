import React, { useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";
import Icon from "react-native-vector-icons/MaterialIcons";
import { styleMicrofono } from "../styles/MicrophoneStyle"; // Importamos los estilos
import { saveFile } from "../services/saveFile";

function Microphone({ visible, onClose, onFinish }) {
    // const [permiso, setPermiso] = useState(false);
    const [audio, setAudio] = useState(null);
    
    // Solicitar permisos al abrir el modal y limpiar el timer al cerrarlo
    useEffect(() => {
        if (visible) {
            getPermiso();
        } else {
            return (
                <Text>No se puede mostrar la información</Text>
            )
        }
    }, []);

    // Solicitar permisos de grabación
    const getPermiso = async () => {
        const status = await Audio.requestPermissionsAsync();
        if (status.status === "granted") {
            console.log("Permiso concedido");
            // setPermiso(true);
            startRecording(); // Iniciar la grabación automáticamente
        } else {
            console.log("Permiso no concedido");
            // setPermiso(false);
        }
    };

    // Iniciar la grabación y arrancar el temporizador hasta 5 segundos
    const startRecording = async () => {
        try {
            console.log("Iniciando grabación...");
            // Iniciar la grabación
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setAudio(recording);
            console.log("Grabación iniciada");
        } catch (error) {
            console.error("Error al iniciar la grabación", error);
        }
    };

    // Detener la grabación y enviar el audio
    const stopRecording = async () => {
        try {
            console.log("Deteniendo grabación...");
            if (audio) {
                await audio.stopAndUnloadAsync();
                const fileUri = audio.getURI();
                console.log("Grabación terminada, URI:", fileUri);
                setAudio(null); // Liberamos el objeto de grabación
                handleTitle(fileUri); //  Guardar y enviar el archivo
                onClose(); //  Cierra el modal correctamente

            }
        } catch (error) {
            console.error("Error al detener la grabación", error);
        }
    };

    const handleTitle = async (fileUri) => {
        const response = await saveFile({ fileUri })
        // console.log(response)
        if (response) {
            onFinish(response)
        }
    }


    return (
        <Modal transparent={true} visible={visible} animationType="fade">
            <View style={styleMicrofono.overlay}>
                <View style={styleMicrofono.modalContainer}>

                    <Text style={styleMicrofono.modalTitle}>Grabando...</Text>

                    {/* Icono de micrófono */}
                    <Icon name="mic" size={62} color="blue" style={styleMicrofono.microphoneIcon} />

                    <Text style={styleMicrofono.recordingText}>Grabando...</Text>

                    {/* Botón para detener la grabación manualmente */}
                    <TouchableOpacity onPress={stopRecording} style={styleMicrofono.stopButton}>
                        <Text style={styleMicrofono.stopButtonText}>Detener grabación</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

export default Microphone;
