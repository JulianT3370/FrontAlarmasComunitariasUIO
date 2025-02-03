import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, PermissionsAndroid } from 'react-native';
import Voice from '@react-native-voice/voice';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SpeechToText = ({ onTextRecognized }) => {
    const [text, setText] = useState('');
    const [listening, setListening] = useState(false);

    useEffect(() => {
        // Verifica que Voice está disponible
        if (!Voice || typeof Voice.start !== 'function') {
            console.error("Error: Voice.start no está disponible.");
            return;
        }

        Voice.onSpeechResults = (event) => {
            if (event.value && event.value.length > 0) {
                const recognizedText = event.value[0];
                setText(recognizedText);
                onTextRecognized(recognizedText);
            }
        };

        Voice.onSpeechError = (event) => {
            console.error("Error en reconocimiento de voz:", event.error);
        };

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    const requestMicrophonePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                    {
                        title: "Permiso de micrófono",
                        message: "La aplicación necesita acceso al micrófono para reconocer la voz.",
                        buttonPositive: "Aceptar",
                        buttonNegative: "Cancelar",
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (error) {
                console.error("Error al solicitar permisos:", error);
                return false;
            }
        }
        return true;
    };

    const startListening = async () => {
        const hasPermission = await requestMicrophonePermission();
        if (!hasPermission) {
            alert("No tienes permiso para usar el micrófono.");
            return;
        }

        if (!Voice || typeof Voice.start !== 'function') {
            console.error("Error: Voice.start no está disponible.");
            alert("Error: El reconocimiento de voz no está disponible.");
            return;
        }

        try {
            setListening(true);
            await Voice.start('es-ES');
        } catch (error) {
            console.error("Error al iniciar el reconocimiento de voz:", error);
        }
    };

    const stopListening = async () => {
        if (!Voice || typeof Voice.stop !== 'function') {
            console.error("Error: Voice.stop no está disponible.");
            return;
        }

        try {
            setListening(false);
            await Voice.stop();
        } catch (error) {
            console.error("Error al detener el reconocimiento de voz:", error);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={listening ? stopListening : startListening}>
                <Icon name={listening ? "stop" : "mic"} size={40} color="white" />
            </TouchableOpacity>
            <Text style={styles.text}>{text ? text : "Presiona el micrófono para hablar"}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginTop: 20,
    },
    button: {
        width: 60,
        height: 60,
        backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 30,
    },
    text: {
        marginTop: 10,
        fontSize: 16,
        textAlign: "center",
        color: "#333",
    },
});

export default SpeechToText;

